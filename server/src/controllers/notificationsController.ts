import type { Request, Response } from 'express';
import type { AuthRequest } from './userController.js';
import mongoose from 'mongoose';
import { Notification } from '../models/models.js';

export const fetchNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }

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

export const markNotificationRead = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid notification ID format' });
  }

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
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

export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid notification ID format' });
  }

  try {
    const deleted = await Notification.findByIdAndDelete(id).exec();

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
