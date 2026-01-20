import express from 'express';
import {
  fetchRouteById,
  fetchRoutes,
} from '../controllers/routesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('', fetchRoutes);
router.get('/:id', fetchRouteById);

export default router;
