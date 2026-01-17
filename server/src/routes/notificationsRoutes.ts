import express, { Response } from 'express';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../controllers/notificationsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { sendNotification } from '../utils/notificationHelper.js';
import { AuthRequest } from '../types/index.js';

const router = express.Router();

router.use(protect);

router.post(
  '/test-realtime-reservation',
  async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User ID not found in request' });
      return;
    }

    await sendNotification(
      userId,
      'bivouac_reservation',
      'success',
      'Real-time Test!',
      'You have confirmed your intention to stay overnight at the [BIVOUAC_NAME] on [DATE], reserving [NUMBER_OF_BEDS] places.'
    );

    res.json({ message: 'Test notification sent successfully.' });
  }
);
router.get('/', fetchNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllNotificationsRead);
router.delete('/:id', deleteNotification);

export default router;
