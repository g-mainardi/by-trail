import express from 'express';
import {
  fetchMapRoutes,
  fetchRouteById,
  fetchRoutes,
} from '../controllers/routesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/list', fetchRoutes);
router.get('/map', fetchMapRoutes);
router.get('/route', fetchRouteById);

export default router;
