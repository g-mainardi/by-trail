<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import H2 from '@/layouts/typography/H2.vue';
import { placeholderEmpty } from '@/services/placeholders';
import { type Route } from '@/types';
import {
  Clock as ClockIcon,
  Heart,
  Map as MapIcon,
  MapPin as MapPinIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

function formatDuration(minutes: number): string {
  if (!minutes) return '-';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h : ${m}m`;
}

const props = defineProps<{
  route: Route;
  isFavorite?: boolean;
}>();
const route = props.route;
</script>

<template>
  <Card class="p-4 gap-4 h-full flex flex-col">
    <CardContent class="px-0 flex-1 flex flex-col justify-between">
      <RouterLink :to="`/route/${route._id}`" aria-label="View Route Details">
        <div class="relative w-full mb-2">
          <img
            :src="placeholderEmpty"
            :alt="`${route.title} image`"
            class="w-full rounded-sm object-cover"
          />
        </div>
        <H2>{{ route.title }}</H2>
      </RouterLink>
      <span class="text-xs text-muted-foreground uppercase tracking-wide">
        {{ route.region[0] }}
      </span>
      <div class="grid grid-cols-3 gap-2 mt-2">
        <div class="info">
          <span class="value">{{ route.difficulty }}</span>
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
    <CardFooter class="px-0">
      <Button
        class="rounded-full w-full"
        @click="$emit('toggle-favorite', route._id)"
      >
        <Heart
          :fill="props.isFavorite ? 'var(--background)' : 'var(--primary)'"
          class="transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
          @click="$emit('toggle-favorite', route._id)"
        />
        {{ props.isFavorite ? t('saved') : t('unsaved') }}
      </Button>
    </CardFooter>
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
    "routeType": "Route Type",
    "saved": "Saved",
    "unsaved": "Save"
  },
  "it": {
    "view": "Dettagli",
    "plan": "Naviga",
    "difficulty": "Difficoltà",
    "ascent": "Dislivello Positivo",
    "descent": "Dislivello Negativo",
    "duration": "Tempo",
    "distance": "Distanza",
    "routeType": "Tipo di percorso",
    "saved": "Salvato",
    "unsaved": "Salva"
  },
  "es": {
    "view": "Detalles",
    "plan": "Navegar",
    "difficulty": "Dificultad",
    "ascent": "Desnivel Positivo",
    "descent": "Desnivel Negativo",
    "duration": "Tiempo",
    "distance": "Distancia",
    "routeType": "Tipo de ruta",
    "remove": "Eliminar",
    "save": "Guardar",
    "saved": "Guardado",
    "unsaved": "Guardar"
  }
}
</i18n>
