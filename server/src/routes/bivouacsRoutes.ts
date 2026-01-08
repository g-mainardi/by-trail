import express from 'express';
import {
  fetchBivouacById,
  fetchBivouacs,
  fetchMapBivouacs,
} from '../controllers/bivouacsController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.use(protect);

router.post('/list', fetchBivouacs);
router.post('/map', fetchMapBivouacs);
router.get('/:id', fetchBivouacById);

export default router;
