import express from 'express';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../controllers/notificationsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { sendNotification } from '../utils/notificationHelper.js';

const router = express.Router();

router.use(protect);

router.post('/test-realtime', async (req: any, res) => {
  const userId = req.user.id;

  await sendNotification(
    userId,
    'bivouac_reservation',
    'success',
    'Real-time Test!',
    'If you see this without refreshing, your Socket.io is working perfectly.'
  );

  res.json({ message: 'Socket emit triggered ' });
});
router.get('/', fetchNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllNotificationsRead);
router.delete('/:id', deleteNotification);

export default router;
