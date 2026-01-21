<script setup lang="ts">
import {
  Bell,
  RefreshCcw,
  Tent,
  ThermometerSun,
  UsersRound,
  X,
} from 'lucide-vue-next';
import { computed } from 'vue';

interface Props {
  title: string;
  message: string;
  time: string;
  read: boolean;
  notificationType: string;
  uiType?: 'alert' | 'success' | 'info';
}

const props = withDefaults(defineProps<Props>(), {
  notificationType: 'bivouac_intention',
  uiType: 'info',
});

defineEmits<{
  (e: 'read'): void;
  (e: 'delete'): void;
}>();

const iconMap: Record<string, any> = {
  bivouac_intention: Tent,
  bivouac_intention_update: RefreshCcw,
  bivouac_intention_delete: X,
  bivouac_intention_users: UsersRound,
  weather_alert: ThermometerSun,
};

const currentIcon = computed(() => {
  return iconMap[props.notificationType] || Bell;
});

const colorClasses = computed(() => {
  switch (props.uiType) {
    case 'alert':
      return 'text-red-600';
    case 'success':
      return 'text-green-600';
    case 'info':
    default:
      return 'text-blue-600';
  }
});
</script>

<template>
  <div
    class="group relative flex w-full cursor-pointer items-start space-x-4 rounded-xl border border-gray-300 p-2 mb-1 transition-all duration-200 hover:shadow-md"
    :class="[read ? 'bg-blue-50/70' : 'bg-white']"
    @click="$emit('read')"
  >
    <div class="flex-shrink-0">
      <div
        class="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1"
        :class="colorClasses"
      >
        <component :is="currentIcon" :size="20" stroke-width="2" />
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-start">
        <h3
          class="text-sm font-semibold text-gray-900 pr-4"
          :class="{ 'font-bold': !read }"
        >
          {{ title }}
        </h3>
        <span class="whitespace-nowrap text-xs text-gray-400">{{ time }}</span>
      </div>

      <p class="mt-1 text-sm text-gray-600 leading-relaxed">
        {{ message }}
      </p>
    </div>

    <button
      @click.stop="$emit('delete')"
      class="absolute -top-2 -right-2 hidden h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-red-100 hover:text-red-600 group-hover:flex"
      title="Dismiss"
    >
      &times;
    </button>
  </div>
</template>
