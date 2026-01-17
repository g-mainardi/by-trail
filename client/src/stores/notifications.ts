import api from '@/stores/utility/axiosInstance';
import { defineStore } from 'pinia';
import { socket } from '@/services/socket';
import { ref } from 'vue';

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

// Global variable to track the active listener reference (prevents memory leaks)
let activeSocketHandler: ((n: NotificationItem) => void) | null = null;

export const useNotificationStore = defineStore('notifications', () => {
  const error = ref<string | null>(null);

  // Helper to extract error messages safely
  const setError = (err: any, defaultMessage: string) => {
    const msg = err.response?.data?.message || defaultMessage;
    error.value = msg;
    console.error(defaultMessage, err);
    throw new Error(msg);
  };

  async function fetchNotifications(): Promise<NotificationItem[]> {
    error.value = null;
    try {
      const res = await api.get('/notifications');
      return res.data.notifications;
    } catch (err) {
      setError(err, 'Failed to fetch notifocations');
      return [];
    }
  }

  async function markAsRead(id: UUID): Promise<void> {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (err) {
      setError(err, 'Failed to mark as read');
    }
  }

  async function markAllAsRead(): Promise<void> {
    try {
      await api.patch('/notifications/read-all');
    } catch (err) {
      setError(err, 'Failed to mark all as read');
    }
  }

  async function deleteNotification(id: UUID): Promise<void> {
    try {
      await api.delete(`/notifications/${id}`);
    } catch (err) {
      setError(err, 'Failed to delete notification');
    }
  }

  async function triggerTestNotification(): Promise<void> {
    try {
      await api.post('/notifications/test-realtime-reservation');
    } catch (err) {
      setError(err, 'Failed to trigger test notification');
    }
  }

  function listenForNotifications(callback: (n: NotificationItem) => void) {
    if (activeSocketHandler) {
      socket.off('notification:new', activeSocketHandler);
    }

    // Create the handler and save the reference
    activeSocketHandler = (notification: NotificationItem) => {
      callback(notification);
    };

    socket.on('notification:new', activeSocketHandler);
  }

  function stopListening() {
    if (activeSocketHandler) {
      socket.off('notification:new', activeSocketHandler);
      activeSocketHandler = null;
    }
  }

  return {
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    listenForNotifications,
    stopListening,
    triggerTestNotification,
  };
});
