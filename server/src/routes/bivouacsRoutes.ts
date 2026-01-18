import express from 'express';
import {
  fetchBivouacById,
  fetchBivouacs,
  fetchMapBivouacs,
} from '../controllers/bivouacsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// /api/bivouacs
router.get('/list', fetchBivouacs);
router.get('/map', fetchMapBivouacs);
router.get('/bivouac', fetchBivouacById);

export default router;
