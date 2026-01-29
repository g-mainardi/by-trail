<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import H1 from '@/layouts/typography/H1.vue';
import H2 from '@/layouts/typography/H2.vue';
import { placeholderRoute } from '@/services/placeholders';
import { getCoords, getDurationHM, routeIcon } from '@/services/utility';
import { useFavoriteStore } from '@/stores/favorites';
import { useRouteStore } from '@/stores/routes';
import { RouteDifficultyEnum, type Route } from '@by-trail/shared';
import { LMap, LMarker, LPolyline, LTileLayer } from '@vue-leaflet/vue-leaflet';
import type { Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ChevronsRight,
  Clock as ClockIcon,
  Heart,
  Map as MapIcon,
  MapPin as MapPinIcon,
  SquareDot,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
} from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const favoritesStore = useFavoriteStore();
const routeStore = useRouteStore();
const route = ref<Route | null>(null);
const fallbackCenter: [number, number] = [41.9028, 12.4964]; // Rome
const zoom = ref(13);
const center = ref<[number, number]>(fallbackCenter);
const isFavorite = computed(() => {
  return route.value ? favoritesStore.isFavoriteRoute(route.value._id!) : false;
});

const mapRef = ref<Map | null>(null);
const onMapReady = (map: Map) => {
  mapRef.value = map;
};

const tileLayerUrl = computed(() => {
  return `https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=${__MAP_API_KEY__}`;
});

onMounted(async () => {
  try {
    route.value = await routeStore.fetchRouteById(props.id);
    await favoritesStore.fetchFavoriteRoutes();
  } catch (error) {
    console.error('Error fetching route:', error);
  }
  const coordinates = route.value?.path?.coordinates;
  const firstCoord =
    Array.isArray(coordinates) && coordinates.length > 0
      ? coordinates[0]
      : null;
  if (
    firstCoord &&
    typeof firstCoord.lat === 'number' &&
    typeof firstCoord.lng === 'number'
  ) {
    center.value = [firstCoord.lat, firstCoord.lng];
  } else {
    center.value = [fallbackCenter[0], fallbackCenter[1]];
  }
});

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <Card class="p-4 gap-4">
    <CardTitle>
      <H1>
        {{ route?.title }}
      </H1>
    </CardTitle>
    <CardContent class="flex flex-col md:flex-row gap-4 w-full p-0">
      <!-- LEFT PART -->
      <div class="left w-full md:w-[70%]">
        <!-- IMAGES -->
        <H2>{{ t('images') }}</H2>
        <div class="flex overflow-x-auto gap-4 mt-4 mb-4 pb-2 flex-row">
          <img
            v-for="i in 5"
            :key="i"
            :src="placeholderRoute"
            :alt="`${route?.title} image ${i}`"
            class="rounded-sm object-cover shrink-0 w-1/2"
          />
        </div>

        <!-- TRACK -->
        <H2>{{ t('track') }}</H2>
        <div
          v-if="route"
          style="overflow: hidden; height: 400px; width: 100%"
          class="rounded-lg shadow-lg mt-4"
        >
          <l-map
            v-model:zoom="zoom"
            v-model:center="center"
            :useGlobalLeaflet="false"
            class="w-full h-full z-0"
            style="height: 100%; width: 100%"
            @ready="onMapReady"
          >
            <l-tile-layer
              :url="tileLayerUrl"
              attribution="Maps © Thunderforest, Data © OpenStreetMap contributors"
            />
            <l-marker
              :lat-lng="
                route.path?.coordinates[0]
                  ? [
                      route.path.coordinates[0].lat,
                      route.path.coordinates[0].lng,
                    ]
                  : [0, 0]
              "
              :icon="routeIcon"
            />
            <l-polyline
              :key="`poly-${route._id}`"
              :lat-lngs="getCoords(route.path?.coordinates || [])"
              :color="
                route.difficulty === RouteDifficultyEnum.E
                  ? 'var(--route-e)'
                  : route.difficulty === RouteDifficultyEnum.EE
                    ? 'var(--route-ee)'
                    : route.difficulty === RouteDifficultyEnum.EEA
                      ? 'var(--route-eea)'
                      : route.difficulty === RouteDifficultyEnum.T
                        ? 'var(--route-t)'
                        : 'var(--route-t)'
              "
              :weight="4"
              :opacity="1"
            />
          </l-map>
        </div>
        <div
          v-else
          class="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500"
        >
          <span class="animate-pulse">{{ t('loadingMap') }}</span>
        </div>
      </div>

      <!-- RIGHT PART -->
      <div class="right w-full md:w-[30%]">
        <H2>{{ t('specifications') }}</H2>
        <div class="flex flex-col gap-4 my-4">
          <div class="icon-with-text">
            <ChevronsRight style="min-width: 1rem; min-height: 1rem" />
            <span>{{ route?.routeType }}</span>
          </div>
          <div class="icon-with-text">
            <SquareDot style="min-width: 1rem; min-height: 1rem" />
            <span>{{ t('difficulty') }}: {{ route?.difficulty }}</span>
          </div>
          <div class="icon-with-text">
            <MapPinIcon style="min-width: 1rem; min-height: 1rem" />
            <span class="">{{ route?.region.join(', ') }} </span>
          </div>
          <div class="icon-with-text">
            <MapIcon />
            <span class="">{{ route?.distance }} km </span>
          </div>
          <div class="icon-with-text">
            <ClockIcon />
            <span class=""
              >{{ getDurationHM(route?.duration ?? 0).hours }} h :
              {{ getDurationHM(route?.duration ?? 0).minutes }} m
            </span>
          </div>
          <div class="icon-with-text">
            <TrendingUpIcon />
            <span class="">{{ route?.ascent }} mt </span>
          </div>
          <div class="icon-with-text">
            <TrendingDownIcon />
            <span class="">{{ route?.descent }} mt </span>
          </div>
        </div>

        <H2>{{ t('note') }}</H2>
        <p v-if="route?.note">{{ route?.note }}</p>
        <p v-else>{{ t('no_description_available') }}</p>

        <Button
          class="rounded-full w-full mt-4"
          @click="favoritesStore.toggleFavoriteRoute(route!._id!)"
        >
          <Heart
            :fill="isFavorite ? 'var(--background)' : 'var(--primary)'"
            class="transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
          />
          {{ isFavorite ? t('saved') : t('unsaved') }}
        </Button>
      </div>
    </CardContent>
    <CardFooter></CardFooter>
  </Card>
</template>

<style scoped>
.icon-with-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-with-text span {
  font-family: monospace;
  font-size: 1rem;
}

:deep(.leaflet-bar) {
  border: none;
  box-shadow: none;
}

:deep(.leaflet-control-zoom a) {
  background-color: var(--card);
  color: var(--foreground);
  border: 1px solid var(--border);

  width: 36px;
  height: 36px;
  line-height: 34px;
  font-size: 1.2rem;
  font-family: var(--font-sans);
  font-weight: 500;

  border-radius: var(--radius) !important;
  margin-bottom: 8px;
  box-shadow: var(--shadow-sm);

  transition: all 0.2s;
}

:deep(.leaflet-control-zoom a:hover) {
  background-color: var(--accent);
  color: var(--accent-foreground);
  border-color: var(--accent);
  text-decoration: none;
}

:deep(.leaflet-control-zoom a.leaflet-disabled) {
  background-color: var(--muted);
  color: var(--muted-foreground);
  border-color: var(--border);
  opacity: 0.5;
  cursor: not-allowed;
}

:deep(.leaflet-touch .leaflet-control-zoom-in),
:deep(.leaflet-touch .leaflet-control-zoom-out) {
  border-radius: var(--radius) !important;
}
</style>

<i18n>
{
  "en": {
    "images": "Images",
    "note": "Note",
    "specifications": "Specifications",
    "track": "Track",
    "loadingMap": "Loading map...",
    "route_type": "Route Type",
    "difficulty": "Difficulty",
    "no_description_available": "No description available.",
    "saved": "Saved",
    "unsaved": "Unsaved"
  },
  "it": {
    "images": "Immagini",
    "note": "Nota",
    "specifications": "Specifiche",
    "track": "Tracciato",
    "loadingMap": "Caricamento mappa...",
    "route_type": "Tipo di Percorso",
    "difficulty": "Difficoltà",
    "no_description_available": "Nessuna descrizione disponibile.",
    "saved": "Salvato",
    "unsaved": "Non salvato"
  },
  "es": {
    "images": "Imágenes",
    "note": "Nota",
    "specifications": "Especificaciones",
    "track": "Ruta",
    "loadingMap": "Cargando mapa...",
    "route_type": "Tipo de Ruta",
    "difficulty": "Dificultad",
    "no_description_available": "No hay descripción disponible.",
    "saved": "Guardado",
    "unsaved": "No guardado"
  }
}
</i18n>
