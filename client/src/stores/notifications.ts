import api from '@/stores/utility/axiosInstance';
import { defineStore } from 'pinia';
import { socket } from '@/services/socket';

type UUID = string;

export interface NotificationItem {
  _id: UUID;
  recipient: string;
  type: string;
  uiType: 'alert' | 'success' | 'info';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const useNotificationStore = defineStore('notifications', () => {
  async function fetchNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await api.get('/notifications');
      return res.data.notifications;
    } catch (error) {
      console.error('Fetch error', error);
      throw error;
    }
  }

  async function markAsRead(id: UUID): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  }

  async function deleteNotification(id: UUID): Promise<void> {
    await api.delete(`/notifications/${id}`);
  }

  function listenForNotifications(callback: (n: NotificationItem) => void) {
    // Listen for the specific event name we emit in the helper
    socket.on('notification:new', (notification: NotificationItem) => {
      callback(notification);
    });
  }

  function stopListening() {
    socket.off('notification:new');
  }

  return {
    fetchNotifications,
    markAsRead,
    deleteNotification,
    listenForNotifications,
    stopListening,
  };
});
