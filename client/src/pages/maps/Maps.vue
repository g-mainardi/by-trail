<script setup lang="ts">
import { useBivouacStore } from '@/stores/bivouacs';
import { useRouteStore } from '@/stores/routes';
import { RouteDifficultyEnum } from '@/types';
import {
  LMap,
  LMarker,
  LPolyline,
  LPopup,
  LTileLayer,
} from '@vue-leaflet/vue-leaflet';
import { useDebounceFn } from '@vueuse/core';
import type { Icon, IconOptions, Map } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { computed, ref } from 'vue';
import FilterBar from '../filterbar/FilterBar.vue';
import {
  bivouacFilters,
  getFilteredBivouacs,
  getFilteredRoutes,
  resetBivouacFilters,
  resetRoutesFilters,
  routeFilters,
} from '../filterbar/filters';

const bivouacStore = useBivouacStore();
const routeStore = useRouteStore();

const mapPinHouseIconUrl = new URL(
  '@/assets/map-pin-house.svg',
  import.meta.url
).href;

const routeIconUrl = new URL('@/assets/route.svg', import.meta.url).href;

const iconSize: [number, number] = [30, 30];
const bivouacIcon = L.divIcon({
  className: 'bivouac-icon-wrapper',
  html: `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${iconSize[0]}px;
      height: ${iconSize[1]}px;
      background: var(--primary);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    ">
      <img src="${mapPinHouseIconUrl}" alt="Bivouac" style="width: 60%; height: 60%; filter: brightness(0) invert(1);" />
    </div>
  `,
  iconSize: iconSize as [number, number],
  iconAnchor: [iconSize[0] / 2, iconSize[1] - iconSize[0] / 2] as [
    number,
    number,
  ],
}) as Icon<IconOptions>;

const routeIcon = L.divIcon({
  className: 'route-icon-wrapper',
  html: `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${iconSize[0]}px;
      height: ${iconSize[1]}px;
      background: #bc6c25;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    ">
      <img src="${routeIconUrl}" alt="Route" style="width: 60%; height: 60%; filter: brightness(0) invert(1);" />
    </div>
  `,
  iconSize: iconSize as [number, number],
  iconAnchor: [iconSize[0] / 2, iconSize[1] - iconSize[0] / 2] as [
    number,
    number,
  ],
}) as Icon<IconOptions>;

const zoom = ref(6);
const center = ref<[number, number]>([41.9100711, 12.5359979]); // Rome

const tileLayerUrl = computed(() => {
  return `https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=${__MAP_API_KEY__}`;
});

function getCoords(
  coords: { lat: number; lng: number }[]
): L.LatLngExpression[] {
  return coords.map((coord) => [coord.lat, coord.lng]);
}

const mapRef = ref<Map | null>(null);
const onMapReady = (map: Map) => {
  mapRef.value = map;
  debouncedFetchBivouacs();
};

const debouncedFetchBivouacs = useDebounceFn(async () => {
  if (!mapRef.value) return;
  const bounds = mapRef.value.getBounds();
  const northWest = bounds.getNorthWest();
  const southEast = bounds.getSouthEast();
  await bivouacStore.fetchMapBivouacs(northWest, southEast);
  await routeStore.fetchMapRoutes(northWest, southEast);
}, 500);

const filteredBivouacs = computed(() => {
  return getFilteredBivouacs(bivouacStore.mapBivouacs);
});

const filteredRoutes = computed(() => {
  return getFilteredRoutes(routeStore.mapRoutes);
});

const placeholder = new URL('@/assets/placeholder.jpg', import.meta.url).href;
</script>

<template>
  <FilterBar
    :bivouacFilters="bivouacFilters"
    :routeFilters="routeFilters"
    @resetBivouacFilters="resetBivouacFilters"
    @resetRouteFilters="resetRoutesFilters"
  />
  <div class="h-full w-full overflow-hidden rounded-lg shadow-lg">
    <l-map
      v-model:zoom="zoom"
      v-model:center="center"
      :useGlobalLeaflet="false"
      class="w-full h-full z-0"
      @ready="onMapReady"
      @update:zoom="debouncedFetchBivouacs()"
      @update:center="debouncedFetchBivouacs()"
    >
      <l-tile-layer :url="tileLayerUrl" />

      <l-marker
        v-for="bivouac in filteredBivouacs"
        :key="bivouac._id"
        :lat-lng="
          bivouac.coords
            ? [bivouac.coords.latitude, bivouac.coords.longitude]
            : [0, 0]
        "
        :icon="bivouacIcon"
      >
        <l-popup :options="{ minWidth: 300, maxWidth: 300 }">
          <RouterLink
            :to="`/bivouac/${bivouac._id}`"
            aria-label="View Bivouac Details"
          >
            <img
              :src="placeholder"
              :alt="`${bivouac.name} image`"
              class="rounded-sm object-cover"
            />
            <h3 class="text-lg font-semibold" style="color: var(--primary)">
              {{ bivouac.name }}
            </h3>
          </RouterLink>
          <p style="margin-top: 0rem; margin-bottom: 0rem">
            {{ bivouac.comune }}, {{ bivouac.region }}
          </p>
        </l-popup>
      </l-marker>

      <l-polyline
        v-for="route in filteredRoutes"
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

      <l-marker
        v-for="route in filteredRoutes"
        :key="route._id"
        :lat-lng="
          route.path?.coordinates[0]
            ? [route.path.coordinates[0].lat, route.path.coordinates[0].lng]
            : [0, 0]
        "
        :icon="routeIcon"
      >
        <l-popup>
          <RouterLink
            :to="`/route/${route._id}`"
            aria-label="View Route Details"
          >
            <img
              :src="placeholder"
              :alt="`${route.title} image`"
              class="rounded-sm object-cover"
            />
            <h3 class="text-lg font-semibold" style="color: var(--primary)">
              {{ route.title }}
            </h3>
          </RouterLink>
          <p style="margin-top: 0rem; margin-bottom: 0rem">
            {{ route.duration }} min -
            {{ route.region.map((r) => r).join(', ') }}
          </p>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<style scoped>
* {
  font-family: var(--font-sans);
}

/* --- Shadcn Card Style --- */
:deep(.icon-wrapper) {
  /* Rimuove lo sfondo bianco di default di Leaflet */
  background: transparent;
  border: none;
  box-shadow: none;
}

.bivouac-icon {
  color: var(--card);
  background-color: var(--primary);
  border-radius: calc(var(--radius) / 2);
  padding: 4px;
  box-shadow: var(--shadow);
}

/* --- STILE PULSANTI ZOOM (Shadcn Button/Outline Style) --- */
/* 1. Rimuove il contenitore unito di default di Leaflet */
:deep(.leaflet-bar) {
  border: none;
  box-shadow: none;
}

/* 2. Stile base dei pulsanti (+ e -) */
:deep(.leaflet-control-zoom a) {
  background-color: var(--card); /* Sfondo Card */
  color: var(--foreground); /* Testo scuro/chiaro in base al tema */
  border: 1px solid var(--border);

  /* Dimensioni e Tipografia */
  width: 36px; /* Un po' più grandi dello standard */
  height: 36px;
  line-height: 34px; /* Centratura verticale (height - borders) */
  font-size: 1.2rem;
  font-family: var(--font-sans); /* Quicksand */
  font-weight: 500;

  /* Forma */
  border-radius: var(--radius) !important; /* Forza il radius del tema */
  margin-bottom: 8px; /* Spazio tra i pulsanti */
  box-shadow: var(--shadow-sm);

  transition: all 0.2s;
}

/* 3. Stile Hover (Accent) */
:deep(.leaflet-control-zoom a:hover) {
  background-color: var(--accent);
  color: var(--accent-foreground);
  border-color: var(--accent);
  text-decoration: none;
}

/* 4. Stile Disabilitato (es. zoom massimo raggiunto) */
:deep(.leaflet-control-zoom a.leaflet-disabled) {
  background-color: var(--muted);
  color: var(--muted-foreground);
  border-color: var(--border);
  opacity: 0.5;
  cursor: not-allowed;
}

/* 5. Override specifico per Leaflet che a volte forza radius strani */
:deep(.leaflet-touch .leaflet-control-zoom-in),
:deep(.leaflet-touch .leaflet-control-zoom-out) {
  border-radius: var(--radius) !important;
}

:deep(.leaflet-popup-content) {
  margin: 0.5rem;
  padding: 0;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  margin: 0%;
}

:deep(.leaflet-popup-close-button span) {
  color: var(--muted-foreground);
  font-size: 1.5rem;
  text-align: center;
}
</style>
