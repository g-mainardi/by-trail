<script setup lang="ts">
import { useBivouacStore, type Bivouac } from '@/stores/bivouacs';
import {
  LIcon,
  LMap,
  LMarker,
  LPopup,
  LTileLayer,
} from '@vue-leaflet/vue-leaflet';
import { useDebounceFn } from '@vueuse/core';
import type { LatLng, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinHouse } from 'lucide-vue-next';
import { computed, ref } from 'vue';

const zoom = ref(6);
const center = ref<[number, number]>([41.9100711, 12.5359979]); // Rome

const bivouacs = ref<Bivouac[]>([]);
const iconSize: [number, number] = [30, 30];

const tileLayerUrl = computed(() => {
  return `https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=${__MAP_API_KEY__}`;
});

const mapRef = ref<Map | null>(null);
const onMapReady = (map: Map) => {
  mapRef.value = map;
  logBounds();
};

const fetchMapBivouacs = async (northWest: LatLng, southEast: LatLng) => {
  try {
    bivouacs.value = await useBivouacStore().fetchMapBivouacs(
      northWest,
      southEast
    );
  } catch (error) {
    console.error('Error fetching map bivouacs:', error);
  }
};

const debouncedFetchBivouacs = useDebounceFn(() => {
  if (!mapRef.value) return;
  const bounds = mapRef.value.getBounds();
  const northWest = bounds.getNorthWest();
  const southEast = bounds.getSouthEast();
  fetchMapBivouacs(northWest, southEast);
}, 500);

const logBounds = () => {
  debouncedFetchBivouacs();
};
</script>

<template>
  <div class="h-full w-full overflow-hidden rounded-lg shadow-lg">
    <l-map
      v-model:zoom="zoom"
      v-model:center="center"
      :useGlobalLeaflet="false"
      class="w-full h-full z-0"
      @ready="onMapReady"
      @update:zoom="logBounds"
      @update:center="logBounds"
    >
      <l-tile-layer
        :url="tileLayerUrl"
        attribution="Maps © Thunderforest, Data © OpenStreetMap contributors"
      >
      </l-tile-layer>

      <l-marker
        v-for="bivacco in bivouacs"
        :key="bivacco._id"
        :lat-lng="[bivacco.coords.latitude, bivacco.coords.longitude]"
      >
        <l-icon :icon-size="iconSize" class-name="icon-wrapper">
          <MapPinHouse :size="iconSize[0]" class="bivouac-icon" />
        </l-icon>
        <l-popup>
          <div class="popup-content">
            <h3>{{ bivacco.name }}</h3>
          </div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<style scoped>
/* --- STILE ICONE BIVACCO (Shadcn Card Style) --- */
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
</style>
