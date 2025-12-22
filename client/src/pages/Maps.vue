<script lang="ts">
export const description = "Map displaying bivaccos and trails icons"
</script>

<script setup lang="ts">
import bivaccoIcon from '@/assets/bivacco.png'; /* @attribution: <a href="https://www.flaticon.com/free-icons/home" title="home icons">Home icons created by Dave Gandy - Flaticon</a> */
import { LIcon, LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import { ref } from 'vue';

const zoom = ref(13);
const center = ref([46.3133334, 11.9787921]);
const bivaccos = ref([
  {
    name: 'Bivacco Bedin',
    // coords: [46.3133334, 11.9787921],
    coords: {
      x: 46.3133334,
      y: 11.9787921,
      z: 2000
    }
  },
  {
    name: 'Bivacco Giacomelli alla Madonnina',
    // coords: [45.9710000, 11.1860000],
    coords: {
      x: 45.9710000,
      y: 11.1860000,
      z: 1800
    }
  }
]);
const iconUrl = bivaccoIcon;
const iconSize = [25, 25];
</script>

<template>
  <l-map v-model:zoom="zoom" :center="center" :useGlobalLeaflet="false" class="w-full h-full z-0">
    <l-tile-layer
      url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=ab8e9f716fab4870bb4378fa9dc9d11c"
      attribution="Maps © Thunderforest, Data © OpenStreetMap contributors"
    >
    </l-tile-layer>

    <l-marker v-for="bivacco in bivaccos" :key="bivacco.name" :lat-lng="[bivacco.coords.x, bivacco.coords.y]">
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