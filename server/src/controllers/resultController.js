import Result from '../models/Result.js';
import Exam from '../models/Exam.js';
import Question from '../models/Question.js';
import User from '../models/User.js';

// @desc    Submit student exam answers & automatically grade (FR-RE-01)
// @route   POST /api/results/submit
// @access  Private (Student)
export const submitExam = async (req, res) => {
  try {
    const { examId, answers = [], time_taken_seconds = 0, tab_switch_count = 0, proctor_flags = [] } = req.body;
    const studentId = req.user._id;

    if (!examId) {
      return res.status(400).json({
        success: false,
        message: 'Exam ID is required.',
      });
    }

    // 1. Verify single-attempt restriction (FR-OE-02)
    const existingResult = await Result.findOne({
      student: studentId,
      exam: examId,
    });

    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this exam. Multiple attempts are not permitted.',
        resultId: existingResult._id,
      });
    }

    // 2. Fetch exam and all questions with answer keys
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found.',
      });
    }

    // Map student responses by questionId for fast O(1) lookup
    const responsesMap = new Map();
    answers.forEach((ans) => {
      responsesMap.set(ans.questionId.toString(), ans.selectedOption);
    });

    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    const gradedAnswers = [];

    // 3. Automated evaluation engine
    exam.questions.forEach((question) => {
      const qIdStr = question._id.toString();
      const selectedOption = responsesMap.has(qIdStr)
        ? responsesMap.get(qIdStr)
        : -1;

      const isUnanswered = selectedOption === -1 || selectedOption === null || selectedOption === undefined;
      const isCorrect = !isUnanswered && selectedOption === question.correct_option;
      const marksAwarded = isCorrect ? (question.marks || 1) : 0;

      if (isUnanswered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
        totalScore += marksAwarded;
      } else {
        wrongCount++;
      }

      gradedAnswers.push({
        questionId: question._id,
        selectedOption: isUnanswered ? -1 : selectedOption,
        isCorrect,
        marksAwarded,
      });
    });

    // Calculate percentage (bounded 0 to 100)
    const percentage = exam.total_marks > 0
      ? Number(((totalScore / exam.total_marks) * 100).toFixed(2))
      : 0;

    const status = totalScore >= exam.passing_marks ? 'Pass' : 'Fail';

    // 4. Save result with proctoring audit
    const result = await Result.create({
      student: studentId,
      exam: exam._id,
      total_score: totalScore,
      correct_count: correctCount,
      wrong_count: wrongCount,
      unanswered_count: unansweredCount,
      percentage,
      status,
      answers: gradedAnswers,
      time_taken_seconds,
      tab_switch_count: Number(tab_switch_count) || 0,
      proctor_flags: Array.isArray(proctor_flags) ? proctor_flags : [],
      submitted_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Exam submitted and evaluated successfully!',
      resultId: result._id,
      scorecard: {
        total_score: totalScore,
        total_marks: exam.total_marks,
        passing_marks: exam.passing_marks,
        percentage,
        status,
        correct_count: correctCount,
        wrong_count: wrongCount,
        unanswered_count: unansweredCount,
        time_taken_seconds,
        tab_switch_count: Number(tab_switch_count) || 0,
      },
    });
  } catch (error) {
    console.error('Submit exam error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing exam submission.',
    });
  }
};

// @desc    Get student exam history (FR-SM-04)
// @route   GET /api/results/student
// @access  Private (Student)
export const getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate({
        path: 'exam',
        select: 'title duration_mins total_marks passing_marks',
        populate: { path: 'subject', select: 'subject_code subject_name' },
      })
      .sort({ submitted_at: -1 });

    return res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error('Get student results error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch student results.',
    });
  }
};

// @desc    Get detailed result / scorecard by Result ID (FR-RE-02, FR-RE-03)
// @route   GET /api/results/:id
// @access  Private
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate({
        path: 'exam',
        populate: [
          { path: 'subject', select: 'subject_code subject_name' },
          { path: 'created_by', select: 'name email department' },
        ],
      })
      .populate('student', 'name email roll_no department')
      .populate({
        path: 'answers.questionId',
        select: 'question_text options correct_option marks difficulty explanation',
      });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found.',
      });
    }

    // Role check: Students can only view their own results
    if (
      req.user.role === 'student' &&
      result.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view another student\'s scorecard.',
      });
    }

    // Also fetch all results of this student across all subjects for consolidated marksheet
    const allStudentResults = await Result.find({ student: result.student._id })
      .populate({
        path: 'exam',
        populate: { path: 'subject', select: 'subject_code subject_name' },
      })
      .sort({ submitted_at: 1 });

    return res.status(200).json({
      success: true,
      result,
      allStudentResults,
    });
  } catch (error) {
    console.error('Get result by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching result scorecard.',
    });
  }
};

// @desc    Get faculty analytics and class performance summaries (FR-RE-04)
// @route   GET /api/results/analytics
// @access  Private (Teacher/Admin)
export const getTeacherAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalExams = await Exam.countDocuments();
    const totalQuestions = await Question.countDocuments();

    // All results with populated details
    const allResults = await Result.find()
      .populate({
        path: 'exam',
        select: 'title total_marks passing_marks duration_mins is_active',
        populate: { path: 'subject', select: 'subject_code subject_name' },
      })
      .populate('student', 'name email roll_no')
      .sort({ submitted_at: -1 });

    const totalSubmissions = allResults.length;
    const passedSubmissions = allResults.filter((r) => r.status === 'Pass').length;
    const overallPassRate = totalSubmissions > 0
      ? Number(((passedSubmissions / totalSubmissions) * 100).toFixed(1))
      : 0;

    const overallAveragePercentage = totalSubmissions > 0
      ? Number(
          (
            allResults.reduce((acc, curr) => acc + (curr.percentage || 0), 0) /
            totalSubmissions
          ).toFixed(1)
        )
      : 0;

    // Per-exam analytics aggregation
    const exams = await Exam.find().populate('subject', 'subject_code subject_name');
    const examAnalytics = exams.map((exam) => {
      const examResults = allResults.filter(
        (r) => r.exam && r.exam._id.toString() === exam._id.toString()
      );
      const submissionCount = examResults.length;
      const passCount = examResults.filter((r) => r.status === 'Pass').length;
      const scores = examResults.map((r) => r.total_score);

      const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
      const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
      const avgScore = scores.length > 0
        ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
        : 0;
      const avgPct = examResults.length > 0
        ? Number((examResults.reduce((a, b) => a + b.percentage, 0) / examResults.length).toFixed(1))
        : 0;

      return {
        examId: exam._id,
        examTitle: exam.title,
        subjectCode: exam.subject?.subject_code || 'N/A',
        subjectName: exam.subject?.subject_name || 'N/A',
        totalMarks: exam.total_marks,
        passingMarks: exam.passing_marks,
        isActive: exam.is_active,
        submissions: submissionCount,
        passCount,
        failCount: submissionCount - passCount,
        passRate: submissionCount > 0 ? Number(((passCount / submissionCount) * 100).toFixed(1)) : 0,
        averageScore: avgScore,
        averagePercentage: avgPct,
        highestScore,
        lowestScore,
      };
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalExams,
        totalQuestions,
        totalSubmissions,
        overallPassRate,
        overallAveragePercentage,
      },
      examAnalytics,
      recentResults: allResults.slice(0, 20),
    });
  } catch (error) {
    console.error('Teacher analytics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate class analytics.',
    });
  }
};
