<script setup lang="ts">
import { placeholderBivouac, placeholderRoute } from '@/services/placeholders';
import {
  bivouacIcon,
  getCoords,
  getDurationHM,
  routeIcon,
} from '@/services/utility';
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
import type { Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FilterBar from '../filterbar/FilterBar.vue';
import {
  bivouacFilters,
  getFilteredBivouacs,
  getFilteredRoutes,
  resetBivouacFilters,
  resetRoutesFilters,
  routeFilters,
} from '../filterbar/filters';
const { t } = useI18n();

const bivouacStore = useBivouacStore();
const routeStore = useRouteStore();

const zoom = ref(6);
const center = ref<[number, number]>([41.9100711, 12.5359979]); // Rome

const tileLayerUrl = computed(() => {
  return `https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=${__MAP_API_KEY__}`;
});

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
  await bivouacStore.fetchBivouacs(northWest, southEast);
  await routeStore.fetchRoutes(northWest, southEast);
}, 500);

const filteredBivouacs = computed(() => {
  return getFilteredBivouacs(bivouacStore.bivouacs);
});

const filteredRoutes = computed(() => {
  return getFilteredRoutes(routeStore.routes);
});
</script>

<template>
  <FilterBar
    :bivouacFilters="bivouacFilters"
    :routeFilters="routeFilters"
    @resetBivouacFilters="resetBivouacFilters"
    @resetRouteFilters="resetRoutesFilters"
  />
  <l-map
    v-model:zoom="zoom"
    v-model:center="center"
    :useGlobalLeaflet="false"
    class="w-full h-full z-0"
    @ready="onMapReady"
    @update:zoom="debouncedFetchBivouacs()"
    @update:center="debouncedFetchBivouacs()"
  >
    <l-tile-layer
      :url="tileLayerUrl"
      attribution="Maps © Thunderforest, Data © OpenStreetMap contributors"
    />

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
            :src="placeholderBivouac"
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
        <RouterLink :to="`/route/${route._id}`" aria-label="View Route Details">
          <img
            :src="placeholderRoute"
            :alt="`${route.title} image`"
            class="rounded-sm object-cover"
          />
          <h3 class="text-lg font-semibold" style="color: var(--primary-2)">
            {{ route.title }}
          </h3>
        </RouterLink>
        <p
          style="margin-top: 0rem; margin-bottom: 0rem"
          class="flex flex-row justify-between"
        >
          <span>{{ route.region.map((r) => r).join(', ') }}</span>
          <span
            >{{ getDurationHM(route.duration).hours }} {{ t('hours') }}</span
          >
          <span
            >{{ getDurationHM(route.duration).minutes }} {{ t('min') }}</span
          >
          <span>{{ t('difficulty') }}: {{ route.difficulty }}</span>
        </p>
      </l-popup>
    </l-marker>
  </l-map>
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

<i18n>
{
  "en": {
    "hours": "Hours",
    "min": "Minutes",
    "difficulty": "Difficulty"
  },
  "it": {
    "hours": "Ore",
    "min": "Minuti",
    "difficulty": "Difficoltà"
  },
  "es": {
    "hours": "Horas",
    "min": "Minutos",
    "difficulty": "Dificultad"
  }
}
</i18n>
