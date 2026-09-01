import express from 'express';
import {
  register,
  login,
  adminLogin,
  getMe,
  updateProfile,
  getAllUsers,
  deleteUser,
  createFacultyAccount,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/faculty', protect, authorize('admin'), createFacultyAccount);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, authorize('teacher', 'admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;
