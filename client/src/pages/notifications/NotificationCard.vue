<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardFooter from '@/components/ui/card/CardFooter.vue';
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
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

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
    <CardTitle class="flex flex-row items-start gap-4 text-lg">
      <div class="flex flex-row items-ce gap-4 text-lg">
        <component :is="currentIcon" :size="20" stroke-width="2" />
        <span>{{ title }}</span>
      </div>
      <span class="ml-auto text-xs flex items-center gap-2">{{ time }}</span>
    </CardTitle>
    <CardContent class="p-0">
      {{ message }}
    </CardContent>
    <CardFooter class="p-0 flex justify-between items-end">
      <span v-if="!read" class="text-xs italic text-muted-foreground">
        {{ t('new') }}
      </span>
      <span v-else class="text-xs italic text-muted-foreground">
        {{ t('read') }}
      </span>
      <Button
        variant="destructive"
        style="font-size: 10px"
        @click.stop="$emit('delete')"
        :title="t('delete_notification')"
      >
        {{ t('delete') }}
      </Button>
    </CardFooter>
  </Card>
</template>

<i18n>
{
  "en": {
    "delete_notification": "Delete notification",
    "new": "New",
    "read": "Read",
    "delete": "Delete"
  },
  "it": {
    "delete_notification": "Elimina notifica",
    "new": "Nuovo",
    "read": "Letto",
    "delete": "Elimina"
  },
  "es": {
    "delete_notification": "Eliminar notificación",
    "new": "Nuevo",
    "read": "Leído",
    "delete": "Eliminar"
  }
}
</i18n>
