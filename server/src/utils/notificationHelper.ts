// notificationHelper connects your business logic to both Mongoose and Socket
import { Notification } from '../models/models.js';
import { getIO } from '../config/socket.js';

/* Saves a notification to DB and attempts to send it via Socket.io */
export const sendNotification = async (
  recipientId: string,
  type: string,
  uiType: 'alert' | 'success' | 'info',
  title: string,
  message: string,
  data: any = {}
) => {
  try {
    // 1. Save to Database
    const newNotification = await Notification.create({
      recipient: recipientId,
      type,
      uiType,
      title,
      message,
      data,
      isRead: false,
    });

    // 2. Emit real-time
    try {
      const io = getIO();
      // "recipientId" is the room name we joined in socket.ts
      io.to(recipientId).emit('notification:new', newNotification);
    } catch (socketError) {
      console.warn(
        'Socket emit failed (user might be offline, which is fine):',
        socketError
      );
    }

    return newNotification;
  } catch (error) {
    console.error('Critical Error: Failed to save notification:', error);
    throw error;
  }
};
