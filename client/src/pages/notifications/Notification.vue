<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  useNotificationStore,
  type NotificationItem,
} from '@/stores/notifications';
import { useI18n } from 'vue-i18n';

import NotificationCard from '@/pages/notifications/NotificationCard.vue';
import Card from '@/components/ui/card/Card.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import Button from '@/components/ui/button/Button.vue';
import H3 from '@/layouts/typography/H3.vue';
import { MailOpen } from 'lucide-vue-next';

const notificationStore = useNotificationStore();
const notifications = ref<NotificationItem[]>([]);
const isLoading = ref(false);
const { t } = useI18n();

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
  <Card class="card">
    <CardHeader>
      <Button
        @click="markAllRead"
        class="text-sm font-medium transition-colors"
      >
        {{ t('notifications_mark_all_read') }}
      </Button>
    </CardHeader>

    <CardContent>
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
    </CardContent>

    <div v-if="notifications.length === 0" class="mt-10 text-center">
      <MailOpen class="mx-auto" />
      <H3 class="mt-2 text-sm font-medium text-gray-900">{{
        t('no_notifications')
      }}</H3>
    </div>
  </Card>
</template>
<i18n>
  {
    "en": {
      "notifications_mark_all_read": "Mark all as read",
      "no_notifications": "No Notifications",
    },
    "it": {
      "notifications_mark_all_read": "Segna tutte come lette",
      "no_notifications": "Nessuna Notifica",
    },
    "es": {
      "notifications_mark_all_read": "Marcar todas como leídas",
      "no_notifications": "No hay notificaciones",
    }
  }
</i18n>
