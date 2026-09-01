import Subject from '../models/Subject.js';
import Question from '../models/Question.js';
import Exam from '../models/Exam.js';

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ subject_code: 1 });
    return res.status(200).json({
      success: true,
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects.',
    });
  }
};

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private (Teacher/Admin)
export const createSubject = async (req, res) => {
  try {
    const { subject_code, subject_name } = req.body;

    if (!subject_code || !subject_name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Subject Code and Subject Name.',
      });
    }

    const exists = await Subject.findOne({
      subject_code: subject_code.toUpperCase().trim(),
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: `Subject with code '${subject_code.toUpperCase()}' already exists.`,
      });
    }

    const subject = await Subject.create({
      subject_code: subject_code.toUpperCase().trim(),
      subject_name: subject_name.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Subject added successfully!',
      subject,
    });
  } catch (error) {
    console.error('Create subject error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating subject.',
    });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Teacher/Admin)
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found.',
      });
    }

    // Check if questions or exams reference this subject
    const questionCount = await Question.countDocuments({ subject: subject._id });
    const examCount = await Exam.countDocuments({ subject: subject._id });

    if (questionCount > 0 || examCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete subject. It is referenced by ${questionCount} question(s) and ${examCount} exam(s).`,
      });
    }

    await Subject.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Subject deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete subject.',
    });
  }
};
