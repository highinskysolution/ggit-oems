import Exam from '../models/Exam.js';
import Question from '../models/Question.js';
import Result from '../models/Result.js';

// @desc    Get all exams (student sees active + completed status; teacher sees all)
// @route   GET /api/exams
// @access  Private
export const getExams = async (req, res) => {
  try {
    const isStudent = req.user.role === 'student';
    const filter = isStudent ? { is_active: true } : {};

    const exams = await Exam.find(filter)
      .populate('subject', 'subject_code subject_name')
      .populate('created_by', 'name email department')
      .sort({ createdAt: -1 });

    // If student, attach whether they have already taken this exam
    let responseExams = exams.map((exam) => exam.toObject());

    if (isStudent) {
      const studentResults = await Result.find({ student: req.user._id });
      const completedExamIds = new Set(
        studentResults.map((r) => r.exam.toString())
      );

      responseExams = responseExams.map((exam) => ({
        ...exam,
        isCompleted: completedExamIds.has(exam._id.toString()),
        resultId: studentResults.find((r) => r.exam.toString() === exam._id.toString())?._id,
      }));
    }

    return res.status(200).json({
      success: true,
      count: responseExams.length,
      exams: responseExams,
    });
  } catch (error) {
    console.error('Get exams error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch exams.',
    });
  }
};

// @desc    Get exam details by ID (Teacher/Admin)
// @route   GET /api/exams/:id
// @access  Private
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('subject', 'subject_code subject_name')
      .populate('created_by', 'name email')
      .populate('questions');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found.',
      });
    }

    return res.status(200).json({
      success: true,
      exam,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching exam.',
    });
  }
};

// @desc    Get secure exam questions for student test room (Strips answer keys & enforces single attempt)
// @route   GET /api/exams/:id/take
// @access  Private (Student)
export const getExamForTest = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('subject', 'subject_code subject_name')
      .populate('questions');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found.',
      });
    }

    if (!exam.is_active) {
      return res.status(403).json({
        success: false,
        message: 'This examination is currently inactive or closed by the instructor.',
      });
    }

    // Check Single Attempt restriction (FR-OE-02)
    const existingResult = await Result.findOne({
      student: req.user._id,
      exam: exam._id,
    });

    if (existingResult) {
      return res.status(400).json({
        success: false,
        alreadyAttempted: true,
        resultId: existingResult._id,
        message: 'You have already submitted this exam. Only one attempt is permitted.',
      });
    }

    // Security: Strip out correct_option and explanation from questions
    const sanitizedQuestions = exam.questions.map((q) => ({
      _id: q._id,
      question_text: q.question_text,
      options: q.options,
      marks: q.marks,
      difficulty: q.difficulty,
    }));

    return res.status(200).json({
      success: true,
      exam: {
        _id: exam._id,
        title: exam.title,
        subject: exam.subject,
        duration_mins: exam.duration_mins,
        total_marks: exam.total_marks,
        passing_marks: exam.passing_marks,
        instructions: exam.instructions,
        question_count: sanitizedQuestions.length,
        questions: sanitizedQuestions,
      },
    });
  } catch (error) {
    console.error('Get exam for test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize exam session.',
    });
  }
};

// @desc    Create new exam (FR-OE-01)
// @route   POST /api/exams
// @access  Private (Teacher/Admin)
export const createExam = async (req, res) => {
  try {
    const {
      title,
      subject,
      duration_mins,
      total_marks,
      passing_marks,
      questions,
      instructions,
      is_active,
    } = req.body;

    if (
      !title ||
      !subject ||
      !duration_mins ||
      !total_marks ||
      !passing_marks ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required exam fields and select at least one question.',
      });
    }

    const exam = await Exam.create({
      title: title.trim(),
      subject,
      created_by: req.user._id,
      duration_mins: Number(duration_mins),
      total_marks: Number(total_marks),
      passing_marks: Number(passing_marks),
      questions,
      instructions: instructions ? instructions.trim() : undefined,
      is_active: is_active !== undefined ? is_active : true,
    });

    const populatedExam = await Exam.findById(exam._id)
      .populate('subject', 'subject_code subject_name')
      .populate('created_by', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Exam created successfully!',
      exam: populatedExam,
    });
  } catch (error) {
    console.error('Create exam error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create exam.',
    });
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private (Teacher/Admin)
export const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found.',
      });
    }

    const {
      title,
      subject,
      duration_mins,
      total_marks,
      passing_marks,
      questions,
      instructions,
      is_active,
    } = req.body;

    if (title) exam.title = title.trim();
    if (subject) exam.subject = subject;
    if (duration_mins) exam.duration_mins = Number(duration_mins);
    if (total_marks) exam.total_marks = Number(total_marks);
    if (passing_marks) exam.passing_marks = Number(passing_marks);
    if (Array.isArray(questions)) exam.questions = questions;
    if (instructions !== undefined) exam.instructions = instructions.trim();
    if (is_active !== undefined) exam.is_active = is_active;

    await exam.save();

    const populatedExam = await Exam.findById(exam._id)
      .populate('subject', 'subject_code subject_name')
      .populate('created_by', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Exam updated successfully!',
      exam: populatedExam,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update exam.',
    });
  }
};

// @desc    Toggle exam active state
// @route   PATCH /api/exams/:id/toggle-status
// @access  Private (Teacher/Admin)
export const toggleExamStatus = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found.',
      });
    }

    exam.is_active = !exam.is_active;
    await exam.save();

    return res.status(200).json({
      success: true,
      message: `Exam status changed to ${exam.is_active ? 'Active' : 'Inactive'}`,
      is_active: exam.is_active,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle exam status.',
    });
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private (Teacher/Admin)
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found.',
      });
    }

    // Also delete associated student results for clean cascade
    await Result.deleteMany({ exam: exam._id });
    await Exam.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Exam and all associated student results deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete exam.',
    });
  }
};
