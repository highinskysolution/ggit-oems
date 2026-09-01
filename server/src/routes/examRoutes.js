import express from 'express';
import {
  getExams,
  getExamById,
  getExamForTest,
  createExam,
  updateExam,
  toggleExamStatus,
  deleteExam,
} from '../controllers/examController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getExams);
router.get('/:id/take', protect, authorize('student'), getExamForTest);
router.get('/:id', protect, getExamById);
router.post('/', protect, authorize('teacher', 'admin'), createExam);
router.put('/:id', protect, authorize('teacher', 'admin'), updateExam);
router.patch('/:id/toggle-status', protect, authorize('teacher', 'admin'), toggleExamStatus);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteExam);

export default router;
