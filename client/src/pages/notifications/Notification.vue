<script setup lang="ts">
import { ref } from 'vue';
import NotificationCard from '@/pages/notifications/NotificationCard.vue';

// 1. Define the Interface for your data
interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
}

// 2. Type the Ref as an array of that Interface
const notifications = ref<NotificationItem[]>([
  {
    id: 1,
    title: '⚠️ Weather Alert: Heavy Rain',
    message:
      'The forecast for your "Alpine Loop" trek has changed. Expect heavy rainfall this Saturday afternoon. Please pack accordingly.',
    time: '10 min ago',
    type: 'alert',
    read: false,
  },
  {
    id: 2,
    title: 'Registration Confirmed',
    message:
      'You have successfully registered for the "Introduction to Navigation" course. See you on the trail!',
    time: '2 hours ago',
    type: 'success',
    read: false,
  },
  {
    id: 3,
    title: 'New Route Added',
    message:
      'A new scenic route "Eagle\'s Nest" has been added to the university database. Check it out now.',
    time: '1 day ago',
    type: 'info',
    read: true,
  },
]);

// 3. Type arguments explicitly
const markRead = (id: number) => {
  const n = notifications.value.find((x) => x.id === id);
  if (n) n.read = true;
};

const removeNotification = (id: number) => {
  notifications.value = notifications.value.filter((x) => x.id !== id);
};

const markAllRead = () => {
  notifications.value.forEach((n) => (n.read = true));
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
          :key="notif.id"
          :title="notif.title"
          :message="notif.message"
          :time="notif.time"
          :read="notif.read"
          :type="notif.type"
          @read="markRead(notif.id)"
          @delete="removeNotification(notif.id)"
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
