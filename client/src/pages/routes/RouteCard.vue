<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import H2 from '@/layouts/typography/H2.vue';
import type { TrekkingRoute } from '@/stores/routes';
import {
  Clock as ClockIcon,
  Map as MapIcon,
  MapPin as MapPinIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  route: TrekkingRoute;
}>();

function formatDuration(minutes: number): string {
  if (!minutes) return '-';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h:${m}m`;
}

const route = props.route;

// Helper to determine difficulty color
const getDifficultyColor = (diff: string) => {
  switch (diff) {
    case 'T':
      return 'text-green-600 border-green-200 bg-green-50';
    case 'E':
      return 'text-blue-600 border-blue-200 bg-blue-50';
    case 'EE':
      return 'text-orange-600 border-orange-200 bg-orange-50';
    case 'EEA':
      return 'text-red-600 border-red-200 bg-red-50';
    default:
      return 'text-gray-600';
  }
};
const placeholder = new URL('@/assets/placeholder.jpg', import.meta.url).href;
</script>

<template>
  <Card class="p-4 gap-4 h-full flex flex-col">
    <CardContent class="px-0 flex-1 flex flex-col">
      <div class="relative w-full mb-2">
        <img
          :src="placeholder"
          :alt="`${route.title} image`"
          class="w-full rounded-sm object-cover"
        />
      </div>
      <RouterLink :to="`#`" aria-label="View Route Details">
        <H2>{{ route.title }}</H2>
      </RouterLink>
      <span class="text-xs text-muted-foreground uppercase tracking-wide">
        {{ route.region[0] }}
      </span>
      <div class="grid grid-cols-3 gap-2 mt-2">
        <div class="info">
          <span class="value" :class="getDifficultyColor(route.difficulty)">{{
            route.difficulty
          }}</span>
          <span class="label">{{ t('difficulty') }}</span>
        </div>

        <div class="info">
          <TrendingUpIcon />
          <span class="value">{{ route.ascent }}</span>
          <span class="label">{{ t('ascent') }}</span>
        </div>

        <div class="info">
          <TrendingDownIcon />
          <span class="value">{{ route.descent }}</span>
          <span class="label">{{ t('descent') }}</span>
        </div>

        <div class="info">
          <ClockIcon />
          <span class="value">{{ formatDuration(route.duration) }}</span>
          <span class="label">{{ t('duration') }}</span>
        </div>

        <div class="info">
          <MapIcon />
          <span class="value">{{ route.distance }}km</span>
          <span class="label">{{ t('distance') }}</span>
        </div>

        <div class="info">
          <MapPinIcon />
          <span class="value">{{ route.routeType }}</span>
          <span class="label">{{ t('routeType') }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
.info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
}

.info span.value {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: monospace;
  font-size: large;
}

.info span.label {
  font-size: small;
  color: var(--muted-foreground);
}
</style>

<i18n>
{
  "en": {
    "view": "Details",
    "plan": "Navigate",
    "difficulty": "Difficulty",
    "ascent": "Elevation Gain",
    "descent": "Elevation Loss",
    "duration": "Duration",
    "distance": "Distance",
    "routeType": "Route Type"
  },
  "it": {
    "view": "Dettagli",
    "plan": "Naviga",
    "difficulty": "Difficoltà",
    "ascent": "Dislivello Positivo",
    "descent": "Dislivello Negativo",
    "duration": "Tempo",
    "distance": "Distanza",
    "routeType": "Tipo di percorso"
  },
  "es": {
    "view": "Detalles",
    "plan": "Navegar",
    "difficulty": "Dificultad",
    "ascent": "Desnivel Positivo",
    "descent": "Desnivel Negativo",
    "duration": "Tiempo",
    "distance": "Distancia",
    "routeType": "Tipo de ruta"
  }
}
</i18n>
