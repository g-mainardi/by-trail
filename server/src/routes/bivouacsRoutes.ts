import express from 'express';
import {
  fetchBivouacs,
  fetchMapBivouacs,
} from '../controllers/bivouacsController.ts';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/list', fetchBivouacs);
router.post('/map', fetchMapBivouacs);

export default router;
