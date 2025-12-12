<script lang="ts">
export const description = "A simple map"
</script>

<script setup lang="ts">
  import 'leaflet/dist/leaflet.css';
  import { ref } from 'vue';
  import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'

  const zoom = ref(13);
  const center = ref([44.1477173, 12.2314194]);
</script>

<template>
  <div class="map-container">
    <l-map
      v-model:zoom="zoom"
      :center="center"
      :useGlobalLeaflet="false"
    >
      <l-tile-layer
        url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=ab8e9f716fab4870bb4378fa9dc9d11c"
        attribution="Maps © Thunderforest, Data © OpenStreetMap contributors"
      >
      </l-tile-layer>
    </l-map>
  </div>
</template>

<style scoped>
  .map-container {
    margin: auto;
    height: 90%;
    width: 90%;
    border: 3px solid green;
    border-radius: 10px;
    overflow: hidden;
  }
</style>