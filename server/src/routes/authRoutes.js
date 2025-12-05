import express from 'express';
import { signup, login } from '../controllers/authController.js'; 
import rateLimit from 'express-rate-limit';

// Rate limiter for authentication endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router = express.Router();

// Define endpoints
router.post('/signup', authRateLimiter, signup);
router.post('/login', authRateLimiter, login);

export default router;