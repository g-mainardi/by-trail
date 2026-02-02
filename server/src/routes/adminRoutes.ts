import express from 'express';
import {
  fetchUsers,
  updateUserStatus,
  deleteUser,
  updateBivouac,
  deleteBivouac,
  updateRoute,
  deleteRoute,
  fetchProposals,
  deleteProposal,
} from '@/controllers/adminController.js';
import { protect } from '@/middleware/authMiddleware.js';
import { admin } from '@/middleware/adminMiddleware.js';

const router = express.Router();

// All routes here are protected -- admin only
router.use(protect, admin);

// /api/admin

// Users management
router.get('/users', fetchUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Bivouacs management
router.patch('/bivouacs/:id', updateBivouac);
router.delete('/bivouacs/:id', deleteBivouac);

// Routes management
router.patch('/routes/:id', updateRoute);
router.delete('/routes/:id', deleteRoute);

// Proposals management
router.get('/proposals', fetchProposals);
router.delete('/proposals/:id', deleteProposal);

export default router;
