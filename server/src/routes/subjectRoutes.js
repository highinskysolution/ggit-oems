import express from 'express';
import {
  getSubjects,
  createSubject,
  deleteSubject,
} from '../controllers/subjectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getSubjects);
router.post('/', protect, authorize('teacher', 'admin'), createSubject);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteSubject);

export default router;
