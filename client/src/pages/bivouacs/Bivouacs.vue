<script setup lang="ts">
import BivouacCard from './BivouacCard.vue';

export interface Bivouac {
  id: number;
  name: string;
  description: string;
  favorite: boolean;
}

let bivouacs: Bivouac[] = [
  { id: 1, name: 'Bivacco Alpha', description: 'A cozy bivacco in the mountains.', favorite: true },
  { id: 2, name: 'Bivacco Beta', description: 'A scenic bivacco near the lake.', favorite: false },
  { id: 3, name: 'Bivacco Gamma', description: 'A rustic bivacco in the forest.', favorite: true },
  { id: 4, name: 'Bivacco Delta', description: 'A modern bivacco with all amenities.', favorite: false },
];

function toggleFavorite(bivouacId: number) {
  console.log(`Toggling favorite for bivouac with ID: ${bivouacId}`);
  const bivouac = bivouacs.find(b => b.id === bivouacId);
  if (bivouac) {
    bivouac.favorite = !bivouac.favorite;
  }
}
</script>

<template>
  <div v-for="bivouac in bivouacs" :key="bivouac.id">
    <BivouacCard :bivouac="bivouac" @toggle-favorite="toggleFavorite(bivouac.id)" />
  </div>
</template>
