import express from 'express';
import { deleteAccount, login, signup } from '@/controllers/authController.js';
import { authRateLimiter, protect } from '@/middleware/authMiddleware.js';

const router = express.Router();
router.use(authRateLimiter); // Apply rate limiting to all routes under /api/auth

// /api/auth
router.post('/signup', signup);
router.post('/login', login);
router.post('/delete', protect, deleteAccount);

export default router;
