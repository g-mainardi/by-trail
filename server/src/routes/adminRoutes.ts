import express from 'express';
import {
  fetchUsers,
  updateUserStatus,
  deleteUser,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected
router.use(protect);

// /api/...
router.get('/users', fetchUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

export default router;
