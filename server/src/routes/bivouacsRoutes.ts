import express from 'express';
import {
  fetchBivouacById,
  fetchBivouacs,
  fetchMapBivouacs,
  fetchFavoriteBivouacs,
} from '../controllers/bivouacsController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.use(protect);

// /api/bivouacs
router.post('/list', fetchBivouacs);
router.post('/map', fetchMapBivouacs);
router.get('/favorites', fetchFavoriteBivouacs);
router.get('/:id', fetchBivouacById);

export default router;
