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

router.post('/test-realtime-reservation', async (req: any, res) => {
  const userId = req.user.id;

  await sendNotification(
    userId,
    'bivouac_reservation',
    'success',
    'Real-time Test!',
    'You have confirmed your intention to stay overnight at the [BIVOUAC_NAME] on [DATE], reserving [NUMBER_OF_BEDS] places.'
  );

  res.json({ message: 'Socket emit triggered ' });
});
router.get('/', fetchNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllNotificationsRead);
router.delete('/:id', deleteNotification);

export default router;
