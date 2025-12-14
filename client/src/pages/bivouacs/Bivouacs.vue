<script setup lang="ts">
import { ref } from 'vue';
import BivouacCard from './BivouacCard.vue';

export interface Bivouac {
  id: number;
  name: string;
  description: string;
  favorite: boolean;
  type: 'bivouac' | 'refuge' | 'cliff-house' | 'tent-site';
  altitude?: number;
  capacity?: number;
  hasToilets?: boolean;
}

let bivouacs = ref<Bivouac[]>([
  { id: 1, name: 'Bivacco Alpha', description: 'A cozy bivacco in the mountains. This is a great place to relax and enjoy nature.', favorite: true, type: 'bivouac', altitude: 1500, capacity: 10, hasToilets: true },
  { id: 2, name: 'Rifugio Beta', description: 'A scenic bivacco near the lake. This is a great place to relax and enjoy nature.', favorite: false, type: 'refuge', altitude: 1200, capacity: 20, hasToilets: true },
  { id: 3, name: 'Rifugio Gamma', description: 'A rustic bivacco in the forest.', favorite: true, type: 'refuge', altitude: 900, capacity: 15, hasToilets: false },
  { id: 4, name: 'Bivacco Delta', description: 'A modern bivacco with all amenities.', favorite: false, type: 'bivouac', altitude: 1800, capacity: 25, hasToilets: true },
  { id: 5, name: 'Cliff House Epsilon', description: 'A cliff-side bivacco with stunning views.', favorite: false, type: 'cliff-house', altitude: 2000, capacity: 8, hasToilets: false },
  { id: 6, name: 'Tent Site Zeta', description: 'A spacious tent site surrounded by nature.', favorite: true, type: 'tent-site', altitude: 1100, capacity: 30, hasToilets: true },
  { id: 7, name: 'Bivacco Eta', description: 'A hidden gem bivacco in the hills.', favorite: false, type: 'bivouac', altitude: 1300, capacity: 12, hasToilets: false },
  { id: 8, name: 'Rifugio Theta', description: 'A charming bivacco with friendly staff.', favorite: true, type: 'refuge', altitude: 1000, capacity: 18, hasToilets: true }
]);
</script>

<template>
  <div v-for="bivouac in bivouacs" :key="bivouac.id">
    <BivouacCard :bivouac="bivouac" />
  </div>
</template>
