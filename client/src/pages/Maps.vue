<script setup lang="ts">
import bivaccoIcon from '@/assets/bivacco.png'; /* @attribution: <a href="https://www.flaticon.com/free-icons/home" title="home icons">Home icons created by Dave Gandy - Flaticon</a> */
import { useBivouacStore, type Bivouac } from '@/stores/bivouacs';
import { LIcon, LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet';
import { useDebounceFn } from '@vueuse/core';
import type { LatLng, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ref } from 'vue';

const zoom = ref(7);
const center = ref<[number, number]>([45.0703, 7.6869]); // Turin

const bivouacs = ref<Bivouac[]>([]);
const iconUrl = bivaccoIcon;
const iconSize: [number, number] = [25, 25];

const mapRef = ref<Map | null>(null);
const onMapReady = (map: Map) => {
  mapRef.value = map;
  logBounds();
};

const fetchMapBivouacs = async (northWest: LatLng, southEast: LatLng) => {
  try {
    bivouacs.value = await useBivouacStore().fetchMapBivouacs(northWest, southEast);
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
      url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=ab8e9f716fab4870bb4378fa9dc9d11c"
      attribution="Maps © Thunderforest, Data © OpenStreetMap contributors"
    >
    </l-tile-layer>

    <l-marker 
      v-for="bivacco in bivouacs" 
      :key="bivacco._id" 
      :lat-lng="[bivacco.coords.latitude, bivacco.coords.longitude]"
    >
      <l-icon
        :icon-url="iconUrl"
        :icon-size="iconSize"  
        class-name="bivaccoIconStyle"
      />
      <l-popup>
        <div class="popup-content">
          <h3>{{ bivacco.name }}</h3>
        </div>
      </l-popup>
    </l-marker>
  </l-map>
</template>

<style scoped>
  :deep(.bivaccoIconStyle) {
    box-sizing: border-box;
    border: 1px solid #000000;
    border-radius: 5px;
    background-color: rgb(255, 173, 254);
    padding: 5px;
}
</style>