<script setup lang="ts">
import {
  useNotificationStore,
  type NotificationItem,
} from '@/stores/notifications';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import H3 from '@/layouts/typography/H3.vue';
import NotificationCard from '@/pages/notifications/NotificationCard.vue';
import { MailOpen } from 'lucide-vue-next';

const notificationStore = useNotificationStore();
const notifications = ref<NotificationItem[]>([]);
const isLoading = ref(false);
const isTesting = ref(false);
const { t } = useI18n();

const hasUnread = computed(() => notifications.value.some((n) => !n.isRead));

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return t('notifications.time.justNow');
  if (diffMins < 60)
    return t('notifications.time.minutesAgo', { count: diffMins });
  if (diffHours < 24)
    return t('notifications.time.hoursAgo', { count: diffHours });
  return date.toLocaleDateString();
};

// 1. Load History
const loadNotifications = async () => {
  isLoading.value = true;
  try {
    notifications.value = await notificationStore.fetchNotifications();
  } catch (e) {
    console.error('Failed to load notifications', e);
  } finally {
    isLoading.value = false;
  }
};

// 2. Handle real-time
const handleNewNotification = (newNotification: NotificationItem) => {
  // Add new item to the TOP of the list
  notifications.value.unshift(newNotification);
};

const handleRead = async (id: string) => {
  const target = notifications.value.find((n) => n._id === id);
  if (target && !target.isRead) {
    target.isRead = true;
    try {
      await notificationStore.markAsRead(id);
    } catch (e) {
      target.isRead = false;
      console.error('Failed to mark as read', e);
    }
  }
};

const handleAllRead = async () => {
  if (!hasUnread.value) return;

  notifications.value.forEach((n) => (n.isRead = true));

  try {
    await notificationStore.markAllAsRead();
  } catch (e) {
    console.error('Failed to mark all read', e);
    loadNotifications();
  }
};

const handleDelete = async (id: string) => {
  const index = notifications.value.findIndex((n) => n._id === id);

  if (index !== -1) {
    notifications.value.splice(index, 1);
    try {
      await notificationStore.deleteNotification(id);
    } catch (e) {
      console.error('Failed to delete notification', e);
      await loadNotifications();
    }
  }
};

const handleTestNotification = async () => {
  isTesting.value = true;
  try {
    await notificationStore.triggerTestNotification();
  } catch (e) {
    console.error('Failed to trigger test', e);
  } finally {
    isTesting.value = false;
  }
};

onMounted(() => {
  loadNotifications();
  notificationStore.listenForNotifications(handleNewNotification);
});

onUnmounted(() => {
  notificationStore.stopListening();
});
</script>

<template>
  <Card class="card">
    <CardHeader
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
    >
      <Button
        @click="handleTestNotification"
        :disabled="isTesting"
        class="w-full sm:w-auto text-sm font-bold bg-gray-600 hover:bg-gray-500 cursor-pointer"
      >
        {{ isTesting ? t('sending') : t('test_real_time') }}
      </Button>
      <Button
        v-if="hasUnread"
        @click="handleAllRead"
        class="w-full sm:w-auto text-sm font-bold cursor-pointer"
      >
        {{ t('notifications_mark_all_read') }}
      </Button>
    </CardHeader>

    <div
      v-if="notificationStore.error"
      class="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center gap-2"
    >
      <span>{{ notificationStore.error }}</span>
    </div>

    <CardContent>
      <NotificationCard
        v-for="notif in notifications"
        :key="notif._id"
        :title="notif.title"
        :message="notif.message"
        :time="formatTime(notif.createdAt)"
        :read="notif.isRead"
        :notificationType="notif.type"
        :uiType="notif.uiType"
        @read="handleRead(notif._id)"
        @delete="handleDelete(notif._id)"
      />
    </CardContent>

    <div v-if="notifications.length === 0" class="mt-10 text-center">
      <MailOpen class="mx-auto" />
      <H3 class="mt-2 text-sm font-medium">{{ t('no_notifications') }}</H3>
    </div>
  </Card>
</template>
<i18n>
  {
    "en": {
      "notifications_mark_all_read": "Mark all as read",
      "no_notifications": "No Notifications",
      "test_real_time": "Test Real Time Notification",
      "sending": "Sending...",
      "notifications": {
        "time": {
          "justNow": "Just now",
          "minutesAgo": "{count} minute ago | {count} minutes ago",
          "hoursAgo": "{count} hour ago | {count} hours ago"
        }
      }
    },
    "it": {
      "notifications_mark_all_read": "Segna tutte come lette",
      "no_notifications": "Nessuna Notifica",
      "test_real_time": "Test Notifica in Tempo Reale",
      "sending": "Invio in corso...",
      "notifications": {
        "time": {
          "justNow": "Proprio ora",
          "minutesAgo": "{count} minuto fa | {count} minuti fa",
          "hoursAgo": "{count} ora fa | {count} ore fa"
        }
      }
    },
    "es": {
      "notifications_mark_all_read": "Marcar todas como leídas",
      "no_notifications": "No hay notificaciones",
      "test_real_time": "Probar Notificación en Tiempo Real",
      "sending": "Enviando...",
      "notifications": {
        "time": {
          "justNow": "Ahora mismo",
          "minutesAgo": "hace {count} minuto | hace {count} minutos",
          "hoursAgo": "hace {count} hora | hace {count} horas"
        }
      }
    }
  }
</i18n>
