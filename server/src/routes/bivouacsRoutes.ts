import express from 'express';
import { fetchBivouacIntentions } from 'src/controllers/intentionController.js';
import {
  fetchBivouacById,
  fetchBivouacs,
  fetchMapBivouacs,
} from '../controllers/bivouacsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// /api/bivouacs
router.post('/list', fetchBivouacs);
router.post('/map', fetchMapBivouacs);
router.get('/:id', fetchBivouacById);
router.get('/intentions', fetchBivouacIntentions);

export default router;
