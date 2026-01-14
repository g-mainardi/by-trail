import express from 'express';
import {
  fetchBivouacById,
  fetchBivouacs,
  fetchMapBivouacs,
  fetchFavoriteBivouacs,
} from '../controllers/bivouacsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// /api/bivouacs
router.post('/list', fetchBivouacs);
router.post('/map', fetchMapBivouacs);
router.get('/favorites', fetchFavoriteBivouacs);
router.get('/:id', fetchBivouacById);

export default router;
