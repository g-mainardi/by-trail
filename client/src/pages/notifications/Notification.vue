<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  useNotificationStore,
  type NotificationItem,
} from '@/stores/notifications';

import NotificationCard from '@/pages/notifications/NotificationCard.vue';

const notificationStore = useNotificationStore();
const notifications = ref<NotificationItem[]>([]);
const isLoading = ref(false);

// 1. Load History
const loadNotifications = async () => {
  isLoading.value = true;
  try {
    notifications.value = await notificationStore.fetchNotifications();
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

// 2. Handle real-time
const handleNewNotification = (newNotification: NotificationItem) => {
  // Add new item to the TOP of the list
  notifications.value.unshift(newNotification);
};

onMounted(() => {
  loadNotifications();
  notificationStore.listenForNotifications(handleNewNotification);
});

onUnmounted(() => {
  notificationStore.stopListening();
});

const markAllRead = () => {
  notifications.value.forEach((n) => (n.isRead = true));
};

const handleRead = async (id: string) => {
  const target = notifications.value.find((n) => n._id === id);
  if (target && !target.isRead) {
    target.isRead = true;
    await notificationStore.markAsRead(id);
  }
};

const handleDelete = async (id: string) => {
  notifications.value = notifications.value.filter((n) => n._id !== id);
  await notificationStore.deleteNotification(id);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900">
            Notifications
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Stay updated on your upcoming treks.
          </p>
        </div>

        <button
          @click="markAllRead"
          class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div class="space-y-3">
        <NotificationCard
          v-for="notif in notifications"
          :key="notif._id"
          :title="notif.title"
          :message="notif.message"
          :time="new Date(notif.createdAt).toLocaleDateString()"
          :read="notif.isRead"
          :type="notif.uiType"
          @read="handleRead(notif._id)"
          @delete="handleDelete(notif._id)"
        />
      </div>

      <div v-if="notifications.length === 0" class="mt-10 text-center">
        <div class="mx-auto h-12 w-12 text-gray-300 text-4xl">📭</div>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
        <p class="mt-1 text-sm text-gray-500">You're all caught up!</p>
      </div>
    </div>
  </div>
</template>
