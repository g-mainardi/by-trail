<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { Toaster } from 'vue-sonner';
import { socket } from './services/socket.ts';

const onConnect = () => {
  console.log('Client connected with ID: ', socket.id);
};

const onDisconnect = () => {
  console.log('Client disconnected');
};

const onConnectError = (err: any) => {
  console.error('Connection failed:', err.message);
};

onMounted(() => {
  console.log('Attempting to connect...');

  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('connect_error', onConnectError);

  // Checks if already connected to avoid double-connect attempts during hot-reloads
  if (!socket.connected) {
    socket.connect();
  }
});

onUnmounted(() => {
  // Remove listeners to prevent duplicates
  socket.off('connect', onConnect);
  socket.off('disconnect', onDisconnect);
  socket.off('connect_error', onConnectError);

  socket.disconnect();
});
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
