<script setup lang="ts">
import { socket } from '@/services/socket.ts';
import { useNotificationStore } from '@/stores/notifications.ts';
import { useColorMode } from '@vueuse/core';
import { onMounted, onUnmounted } from 'vue';
import { Toaster, toast } from 'vue-sonner';

const notificationStore = useNotificationStore();

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

  if (toastType === 'success') {
    toast.success(notification.title, { description: notification.message });
  } else if (toastType === 'alert') {
    toast.error(notification.title, { description: notification.message });
  } else {
    toast.info(notification.title, { description: notification.message });
  }
};

onMounted(() => {
  console.log('Attempting to connect...');

  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('connect_error', onConnectError);

  notificationStore.listenForNotifications(handleNewNotification);

  const token = localStorage.getItem('token');
  // Checks if already connected to avoid double-connect attempts during hot-reloads
  if (token && !socket.connected) {
    socket.auth = { token };
    socket.connect();
  }
});

onUnmounted(() => {
  // Remove listeners to prevent duplicates
  socket.off('connect', onConnect);
  socket.off('disconnect', onDisconnect);
  socket.off('connect_error', onConnectError);

  notificationStore.stopListening();

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
    }"
  />
  <RouterView />
</template>
