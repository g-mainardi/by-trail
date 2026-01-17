import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import {
  fetchFavoriteBivouacs,
  addFavoriteBivouac,
  removeFavoriteBivouac,
  fetchFavoriteRoutes,
  addFavoriteRoute,
  removeFavoriteRoute,
} from '../controllers/favoritesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected
router.use(protect);

// /api/users/profile
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

// /api/users/favorites/bivouacs
router.get('/favorites/bivouacs', fetchFavoriteBivouacs);
router.post('/favorites/bivouacs', addFavoriteBivouac);
router.delete('/favorites/bivouacs', removeFavoriteBivouac);

// /api/users/favorites/routes
router.get('/favorites/routes', fetchFavoriteRoutes);
router.post('/favorites/routes', addFavoriteRoute);
router.delete('/favorites/routes', removeFavoriteRoute);

export default router;
