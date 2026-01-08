import express from 'express';
import { sendProposal } from '../controllers/proposalController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import rateLimit from 'express-rate-limit';

// Rate limiter for authentication endpoints
const proposalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 sends per windowMs
  message:
    'Too many proposals was sent from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router = express.Router();

// All routes here are protected
router.use(protect);

// /api/users/proposal
router.post('/proposal', proposalRateLimiter, sendProposal);

export default router;
