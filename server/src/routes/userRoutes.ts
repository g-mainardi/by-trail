import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected
router.use(protect);

// /api/users/profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
