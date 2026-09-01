import Question from '../models/Question.js';
import Exam from '../models/Exam.js';

// @desc    Get questions with optional filters (subject, difficulty, search query)
// @route   GET /api/questions
// @access  Private
export const getQuestions = async (req, res) => {
  try {
    const { subject, difficulty, search } = req.query;
    const filter = {};

    if (subject) {
      filter.subject = subject;
    }
    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }
    if (search) {
      filter.question_text = { $regex: search, $options: 'i' };
    }

    const questions = await Question.find(filter)
      .populate('subject', 'subject_code subject_name')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error('Get questions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch questions.',
    });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      'subject',
      'subject_code subject_name'
    );
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    return res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving question.',
    });
  }
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private (Teacher/Admin)
export const createQuestion = async (req, res) => {
  try {
    const { subject, question_text, options, correct_option, marks, difficulty, explanation } = req.body;

    if (!subject || !question_text || !Array.isArray(options) || options.length !== 4 || correct_option === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, question text, exactly 4 options, and the correct option index (0-3).',
      });
    }

    const question = await Question.create({
      subject,
      question_text: question_text.trim(),
      options: options.map((opt) => opt.trim()),
      correct_option: Number(correct_option),
      marks: Number(marks) || 1,
      difficulty: difficulty || 'Medium',
      explanation: explanation ? explanation.trim() : '',
    });

    const populated = await Question.findById(question._id).populate(
      'subject',
      'subject_code subject_name'
    );

    return res.status(201).json({
      success: true,
      message: 'Question created successfully!',
      question: populated,
    });
  } catch (error) {
    console.error('Create question error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating question.',
    });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private (Teacher/Admin)
export const updateQuestion = async (req, res) => {
  try {
    const { subject, question_text, options, correct_option, marks, difficulty, explanation } = req.body;

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    if (subject) question.subject = subject;
    if (question_text) question.question_text = question_text.trim();
    if (Array.isArray(options) && options.length === 4) {
      question.options = options.map((opt) => opt.trim());
    }
    if (correct_option !== undefined) question.correct_option = Number(correct_option);
    if (marks !== undefined) question.marks = Number(marks);
    if (difficulty) question.difficulty = difficulty;
    if (explanation !== undefined) question.explanation = explanation.trim();

    await question.save();

    const populated = await Question.findById(question._id).populate(
      'subject',
      'subject_code subject_name'
    );

    return res.status(200).json({
      success: true,
      message: 'Question updated successfully!',
      question: populated,
    });
  } catch (error) {
    console.error('Update question error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating question.',
    });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private (Teacher/Admin)
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    // Check if any active exams contain this question
    const examsWithQuestion = await Exam.find({ questions: question._id });
    if (examsWithQuestion.length > 0) {
      const examTitles = examsWithQuestion.map((e) => e.title).join(', ');
      return res.status(400).json({
        success: false,
        message: `Cannot delete question because it is used in the following exam(s): ${examTitles}`,
      });
    }

    await Question.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Question deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete question.',
    });
  }
};

// @desc    Bulk create questions
// @route   POST /api/questions/bulk
// @access  Private (Teacher/Admin)
export const bulkCreateQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of questions to create.',
      });
    }

    const created = await Question.insertMany(questions);
    return res.status(201).json({
      success: true,
      message: `Successfully added ${created.length} questions to Question Bank!`,
      count: created.length,
      questions: created,
    });
  } catch (error) {
    console.error('Bulk question creation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to bulk create questions.',
    });
  }
};

