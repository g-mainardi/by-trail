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
router.put('/profile', updateProfile);
router.post('/favorites/bivouacs', fetchFavoriteBivouacs);
router.post('/favorites/bivouacs/:id', addFavoriteBivouac);
router.delete('/favorites/bivouacs/:id', removeFavoriteBivouac);

export default router;
