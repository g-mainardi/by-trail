import express from 'express';
import { sendProposal } from '@/controllers/proposalController.js';
import { protect } from '@/middleware/authMiddleware.js';
import { proposalRateLimiter } from '@/middleware/proposalMiddleware.js';

const router = express.Router();

// All routes here are protected
router.use(protect);

// POST /api/proposal
router.post('/', proposalRateLimiter, sendProposal);

export default router;
