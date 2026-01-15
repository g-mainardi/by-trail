import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import {
  fetchFavoriteBivouacs,
  addFavoriteBivouac,
  removeFavoriteBivouac,
} from '../controllers/favoritesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected
router.use(protect);

// /api/users/...
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.get('/favorites/bivouacs', fetchFavoriteBivouacs);
router.post('/favorites/bivouacs', addFavoriteBivouac);
router.delete('/favorites/bivouacs', removeFavoriteBivouac);

export default router;
