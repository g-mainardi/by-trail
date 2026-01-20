import express from 'express';
import { deleteAccount, login, signup } from '../controllers/authController.js';
import { authRateLimiter, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// /api/auth
router.post('/signup', authRateLimiter, signup);
router.post('/login', authRateLimiter, login);
router.post('/delete', protect, deleteAccount);

export default router;
