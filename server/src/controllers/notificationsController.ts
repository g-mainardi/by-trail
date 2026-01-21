import type { Response } from 'express';
import type { AuthRequest } from '../types/server_only.js';
import { Notification } from '../models/models.js';

export const fetchNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id!;

  // Standard limit to prevent payload bloat
  const DEFAULT_SIZE_LIMIT = 50;

  try {
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(DEFAULT_SIZE_LIMIT)
      .exec();

    // Return empty array instead of 404 for notifications (better for UI logic)
    return res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id!;

  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { isRead: true },
      { new: true }
    ).exec();

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({ notification });
  } catch (error) {
    console.error('Error marking notification read:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const markAllNotificationsRead = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?.id!;
  try {
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );
    return res.status(200).json({ message: 'All marked as read' });
  } catch (error) {
    console.error('Error making all read:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id!;

  try {
    const deleted = await Notification.findOneAndDelete({
      _id: id,
      recipient: userId,
    }).exec();

    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res
      .status(200)
      .json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
