import express from 'express';
import {
  fetchNotifications,
  markNotificationRead,
  deleteNotification,
} from '../controllers/notificationsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', fetchNotifications);
router.delete('/:id', deleteNotification);

export default router;
