import express from 'express';
import { fetchAnonymousBivouacIntentions } from '@/controllers/intentionController.js';
import {
  fetchBivouacById,
  fetchBivouacs,
} from '@/controllers/bivouacsController.js';
import { protect } from '@/middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// /api/bivouacs
router.get('', fetchBivouacs);
router.get('/:id', fetchBivouacById);

// /api/intentions
router.get('/intentions/:id', fetchAnonymousBivouacIntentions);

export default router;
