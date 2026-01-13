<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle
} from '@/components/ui/card';
import ThiigsIcon from '@/components/ui/icons/ThiigsIcon.vue'; // Assuming you use this for custom SVGs
import type { TrekkingRoute } from '@/stores/routes';
import { 
  ArrowUpRight as ArrowUpRightIcon, 
  Eye as EyeIcon, 
  Clock as ClockIcon, 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon, 
  Map as MapIcon,
  MapPin as MapPinIcon
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Use your existing icon paths or Lucid icons where appropriate
const routeIcon = new URL('@/assets/trekking_route_1.png', import.meta.url).href; 

const props = defineProps<{
  route: TrekkingRoute
}>();

function formatDuration(minutes: number): string {
  if (!minutes) return '-';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h : ${m}m`
}

const route = props.route;

// Helper to determine difficulty color
const getDifficultyColor = (diff: string) => {
  switch(diff) {
    case 'T': return 'text-green-600 border-green-200 bg-green-50';
    case 'E': return 'text-blue-600 border-blue-200 bg-blue-50';
    case 'EE': return 'text-orange-600 border-orange-200 bg-orange-50';
    case 'EEA': return 'text-red-600 border-red-200 bg-red-50';
    default: return 'text-gray-600';
  }
};
</script>

<template>
  <Card class="gap-2 p-4 m-4 h-full flex flex-col justify-between">
    <CardTitle class="flex items-start gap-4">
      <div class="p-2 bg-muted rounded-md">
        <ThiigsIcon :alt="'route icon'" :path="routeIcon" :size="6" />
      </div>
      <div class="flex flex-col gap-1">
        <h1 class="text-xl font-bold leading-tight">
          {{ route.title }}
        </h1>
        <span class="text-xs text-muted-foreground uppercase tracking-wide">
          {{ route.region && route.region[0] }}
        </span>
      </div>
    </CardTitle>

    <CardContent class="flex flex-col gap-4 p-0 mt-4">
      <div class="grid grid-cols-3 gap-2">
        
        <div class="flex flex-col items-center justify-center p-1 text-center h-full">
          <span 
            class="text-sm font-bold px-3 py-1 rounded border mb-1"
            :class="getDifficultyColor(route.difficulty)"
          >
            {{ route.difficulty }}
          </span>
          <span class="text-[12px] text-muted-foreground">{{ t('difficulty') }}</span>
        </div>

        <div class="flex flex-col items-center justify-center p-1 text-center h-full">
          <div class="flex flex-col items-center justify-center gap-1 mb-1 w-full">
            <TrendingUpIcon class="h-4 w-4 md:h-5 md:w-5 text-red-600 shrink-0" />
            <span class="font-mono font-bold text-sm md:text-xl lg:text-2xl">{{ route.ascent }}m</span>
          </div>
          <span class="text-[12px] text-muted-foreground">{{ t('ascent') }}</span>
        </div>

        <div class="flex flex-col items-center justify-center p-1 text-center h-full">
          <div class="flex flex-col items-center justify-center gap-1 mb-1 w-full">
            <TrendingDownIcon class="h-4 w-4 md:h-5 md:w-5 text-red-600 shrink-0" />
            <span class="font-mono font-bold text-sm md:text-xl lg:text-2xl">{{ route.descent }}m</span>
          </div>
          <span class="text-[12px] text-muted-foreground">{{ t('descent') }}</span>
        </div>

        <div class="flex flex-col items-center justify-center p-1">
           <div class="flex flex-col items-center justify-center gap-1 mb-1 w-full">
            <ClockIcon class="h-4 w-4 md:h-5 md:w-5 text-green-600 shrink-0" />
            <span class="font-mono font-bold text-sm md:text-xl lg:text-2xl">{{ formatDuration(route.duration) }}</span>
          </div>
          <span class="text-[12px] text-muted-foreground">{{ t('duration') }}</span>
        </div>

        <div class="flex flex-col items-center justify-center p-1">
           <div class="flex flex-col items-center justify-center gap-1 mb-1 w-full">
            <MapIcon class="h-4 w-4 md:h-5 md:w-5 text-blue-600 shrink-0" />
            <span class="font-mono font-bold text-sm md:text-xl lg:text-2xl">{{ route.distance }}km</span>
          </div>
          <span class="text-[12px] text-muted-foreground">{{ t('distance') }}</span>
        </div>

        <div class="flex flex-col items-center justify-center p-1">
           <div class="flex flex-col items-center justify-center gap-1 mb-1 w-full">
            <MapPinIcon class="h-4 w-4 md:h-5 md:w-5 text-orange-600 shrink-0" />
            <span class="font-mono font-bold text-sm md:text-xl lg:text-2xl">{{ route.routeType }}</span>
          </div>
          <span class="text-[12px] text-muted-foreground">{{ t('routeType') }}</span>
        </div>

      </div>
    </CardContent>

    <CardFooter class="flex gap-2 px-0 mt-4">
      <Button class="flex-1" variant="default">
        <EyeIcon class="mr-2 h-4 w-4" />
        <span>{{ t('view') }}</span>
      </Button>
      <Button variant="outline" class="flex-1">
        <ArrowUpRightIcon class="mr-2 h-4 w-4" />
        <span>{{ t('plan') }}</span>
      </Button>
    </CardFooter>

  </Card>
</template>

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