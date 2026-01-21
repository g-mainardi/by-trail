<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import {
  Bell,
  MapPin,
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
  route_intention: MapPin,
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
  <Card
    class="p-4 gap-2"
    :class="[
      !read
        ? 'bg-accent hover:border-accent-foreground border-2 transition-colors duration-200 hover:cursor-pointer'
        : '',
      !read ? 'cursor-pointer' : '',
    ]"
    @click="$emit('read')"
  >
    <CardTitle class="flex flex-row items-center gap-4 text-lg">
      <component :is="currentIcon" :size="20" stroke-width="2" />
      {{ title }}
      <div class="ml-auto text-xs flex items-center gap-2">
        {{ time }}
        <Button
          variant="destructive"
          class="rounded-full"
          style="font-size: 10px"
          @click.stop="$emit('delete')"
          title="Delete notification"
        >
          <X :size="2" />
        </Button>
      </div>
    </CardTitle>
    <CardContent class="p-0">
      {{ message }}
    </CardContent>
  </Card>
</template>
