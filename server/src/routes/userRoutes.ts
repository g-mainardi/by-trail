import express from 'express';
import {
  createIntention,
  deleteIntention,
  fetchUserBivouacIntentions,
} from 'src/controllers/intentionController.js';
import {
  addFavoriteBivouac,
  fetchFavoriteBivouacs,
  removeFavoriteBivouac,
} from '../controllers/favoritesController.js';
import { getProfile, updateProfile } from '../controllers/userController.js';
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

router.post('/intention', createIntention);
router.delete('/intention', deleteIntention);
router.post('/intentions', fetchUserBivouacIntentions);

export default router;
