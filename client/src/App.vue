<script setup lang="ts">
import { socket } from '@/services/socket.ts';
import { useNotificationStore } from '@/stores/notifications';
import { useColorMode } from '@vueuse/core';
import { onMounted, onUnmounted } from 'vue';
import { Toaster, toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

const notificationStore = useNotificationStore();
const router = useRouter();

const onConnect = () => {
  console.log('Client connected with ID: ', socket.id);
};

const onDisconnect = () => {
  console.log('Client disconnected');
};

const onConnectError = (err: any) => {
  console.error('Connection failed:', err.message);
};

const handleNewNotification = (notification: any) => {
  console.log('Real-time notification received:', notification);

  const toastType = notification.uiType || 'info';
  const message =
    'You have received a new message, please go to Notifications page to view it.';

  const toastOptions = {
    description: message,
    action: {
      label: 'View',
      onClick: () => router.push('/notifications'),
    },
    duration: 6000,
  };

  if (toastType === 'success') {
    toast.success(notification.title, toastOptions);
  } else if (toastType === 'alert') {
    toast.error(notification.title, toastOptions);
  } else {
    toast.info(notification.title, toastOptions);
  }
};

onMounted(async () => {
  console.log('Attempting to connect...');

  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('connect_error', onConnectError);

  socket.on('notification:new', handleNewNotification);

  const token = localStorage.getItem('token');
  // Checks if already connected to avoid double-connect attempts during hot-reloads
  if (token && !socket.connected) {
    socket.auth = { token };
    socket.connect();
  }

  if (localStorage.getItem('token')) {
    const notifications = await notificationStore.fetchNotifications();
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    if (unreadCount > 0) {
      toast.info('Welcome back!', {
        description: `You have ${unreadCount} unread notifications.`,
        action: {
          label: 'Check',
          onClick: () => router.push('/notifications'),
        },
        duration: 6000, // Stay visible a bit longer
      });
    }
  }
});

onUnmounted(() => {
  // Remove listeners to prevent duplicates
  socket.off('connect', onConnect);
  socket.off('disconnect', onDisconnect);
  socket.off('connect_error', onConnectError);

  socket.off('notification:new', handleNewNotification);

  socket.disconnect();
});
const mode = useColorMode();
if (localStorage.getItem('theme') === null) {
  mode.value = 'auto';
  localStorage.theme = mode.value;
}
</script>

<template>
  <Toaster
    position="top-center"
    richColors
    :toastOptions="{
      style: {
        borderRadius: 'var(--radius)',
        fontFamily: 'var(--font-sans)',
      },
      classes: {
        title: '!font-bold',
        actionButton: '!font-medium',
      },
    }"
  />
  <RouterView />
</template>
