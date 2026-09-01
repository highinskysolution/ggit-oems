import express from 'express';
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions,
} from '../controllers/questionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getQuestions);
router.get('/:id', protect, getQuestionById);
router.post('/bulk', protect, authorize('teacher', 'admin'), bulkCreateQuestions);
router.post('/', protect, authorize('teacher', 'admin'), createQuestion);
router.put('/:id', protect, authorize('teacher', 'admin'), updateQuestion);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteQuestion);

export default router;
