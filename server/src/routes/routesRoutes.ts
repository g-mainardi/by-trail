import express from 'express';
import { fetchRoutes } from '../controllers/routesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/list', fetchRoutes);

export default router;
