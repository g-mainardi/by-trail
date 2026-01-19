import express from 'express';
import {
  fetchUsers,
  updateUserStatus,
  deleteUser,
  updateBivouac,
  deleteBivouac,
  updateRoute,
  deleteRoute,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All routes here are protected -- admin only
router.use(protect, admin);

// /api/...
router.get('/users', fetchUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.patch('/bivouacs/:id', updateBivouac);
router.delete('/bivouacs/:id', deleteBivouac);
router.patch('/routes/:id', updateRoute);
router.delete('/routes/:id', deleteRoute);

export default router;
