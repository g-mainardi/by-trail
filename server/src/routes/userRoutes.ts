import express from 'express';
import {
  createIntention,
  deleteIntention,
  fetchUserIntentions,
} from '@/controllers/intentionController.js';
import {
  addFavoriteBivouac,
  addFavoriteRoute,
  fetchFavoriteBivouacs,
  fetchFavoriteRoutes,
  removeFavoriteBivouac,
  removeFavoriteRoute,
} from '@/controllers/favoritesController.js';
import { getProfile, updateProfile } from '@/controllers/userController.js';
import { protect } from '@/middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected
router.use(protect);

// /api/users

// Profile management
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

// Favorite bivouacs management
router.get('/favorites/bivouacs', fetchFavoriteBivouacs);
router.post('/favorites/bivouacs', addFavoriteBivouac);
router.delete('/favorites/bivouacs', removeFavoriteBivouac);

// Favorite routes management
router.get('/favorites/routes', fetchFavoriteRoutes);
router.post('/favorites/routes', addFavoriteRoute);
router.delete('/favorites/routes', removeFavoriteRoute);

// Intentions management
router.post('/intentions', createIntention);
router.delete('/intentions', deleteIntention);
router.get('/intentions', fetchUserIntentions);

export default router;
