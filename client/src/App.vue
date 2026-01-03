<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue';
  import { socket } from './services/socket.js';

  const onConnect = () => {
    console.log('Client connected with ID: ', socket.id);
  };

  const onConnectError = (err: any) => {
    console.error('Connection failed:', err.message);
  };

  onMounted(() => {
    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);

    // Checks if already connected to avoid double-connect attempts during hot-reloads
    if (!socket.connected) {
      socket.connect();
    }
  });

  onUnmounted(() => {
    // Remove listeners to prevent duplicates
    socket.off('connect', onConnect);
    socket.off('connect_error', onConnectError);

    socket.disconnect();
  });
</script>

<template>
  <RouterView />
</template>
