<script setup lang="ts">
// 1. Define specific types for the props
type NotificationType = 'alert' | 'success' | 'info';

interface Props {
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: NotificationType; // Optional because we provide a default
}

// 2. Use withDefaults to handle the default 'info' value
withDefaults(defineProps<Props>(), {
  type: 'info',
});

// 3. Typed Emits
defineEmits<{
  (e: 'read'): void;
  (e: 'delete'): void;
}>();

// 4. Record type ensures the keys match our NotificationType
const typeStyles: Record<NotificationType, string> = {
  alert: 'border-l-4 border-l-red-500',
  success: 'border-l-4 border-l-green-500',
  info: 'border-l-4 border-l-blue-400',
};
</script>

<template>
  <div
    class="group relative flex w-full cursor-pointer items-start space-x-4 rounded-xl border border-gray-100 p-4 transition-all duration-200 hover:shadow-md"
    :class="[
      read ? 'bg-white' : 'bg-blue-50/50',
      typeStyles[type] || 'border-l-4 border-l-gray-300',
    ]"
    @click="$emit('read')"
  >
    <div class="flex-shrink-0">
      <div
        class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200"
      >
        <span v-if="type === 'alert'" class="text-xl">⛈️</span>
        <span v-else-if="type === 'success'" class="text-xl">🎒</span>
        <span v-else class="text-xl">📍</span>
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
