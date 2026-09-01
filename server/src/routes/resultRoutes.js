import express from 'express';
import {
  submitExam,
  getStudentResults,
  getResultById,
  getTeacherAnalytics,
} from '../controllers/resultController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', protect, authorize('student'), submitExam);
router.get('/student', protect, authorize('student'), getStudentResults);
router.get('/analytics', protect, authorize('teacher', 'admin'), getTeacherAnalytics);
router.get('/:id', protect, getResultById);

export default router;
