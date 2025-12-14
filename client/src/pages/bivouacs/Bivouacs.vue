<script setup lang="ts">
import { computed, ref } from 'vue';
import BivouacCard from './BivouacCard.vue';
import FilterBar from './FilterBar.vue';

export interface Bivouac {
  id: number;
  name: string;
  description: string;
  favorite: boolean;
  type: 'bivouac' | 'refuge' | 'cliff-house' | 'tent-site';
  altitude?: number;
  capacity?: number;
  hasToilets?: boolean;
  openDate?: Date;
  closeDate?: Date;
}

const bivouacs = ref<Bivouac[]>([
  { id: 1, name: 'Bivacco Alpha', description: 'A cozy bivacco in the mountains. This is a great place to relax and enjoy nature.', favorite: true, type: 'bivouac', altitude: 1500, capacity: 10, hasToilets: true, openDate: new Date('2024-06-01'), closeDate: new Date('2024-09-30') },
  { id: 2, name: 'Rifugio Beta', description: 'A scenic bivacco near the lake. This is a great place to relax and enjoy nature.', favorite: false, type: 'refuge', altitude: 1200, capacity: 20, hasToilets: true },
  { id: 3, name: 'Rifugio Gamma', description: 'A rustic bivacco in the forest.', favorite: true, type: 'refuge', altitude: 900, capacity: 15, hasToilets: false, openDate: new Date('2024-05-15'), closeDate: new Date('2024-10-15') },
  { id: 4, name: 'Bivacco Delta', description: 'A modern bivacco with all amenities.', favorite: false, type: 'bivouac', altitude: 1800, capacity: 25, hasToilets: true },
  { id: 5, name: 'Cliff House Epsilon', description: 'A cliff-side bivacco with stunning views.', favorite: false, type: 'cliff-house', altitude: 2000, capacity: 8, hasToilets: false },
  { id: 6, name: 'Tent Site Zeta', description: 'A spacious tent site surrounded by nature.', favorite: true, type: 'tent-site', altitude: 1100, capacity: 30, hasToilets: true },
  { id: 7, name: 'Bivacco Eta', description: 'A hidden gem bivacco in the hills.', favorite: false, type: 'bivouac', altitude: 1300, capacity: 12, hasToilets: false },
  { id: 8, name: 'Rifugio Theta', description: 'A charming bivacco with friendly staff.', favorite: true, type: 'refuge', altitude: 1000, capacity: 18, hasToilets: true }
]);

const filters = ref({
  desiredBeds: 4,
  withToiletsOnly: false,
  favoritesOnly: false,
  minAltitude: 0,
  maxAltitude: 5000,
  onlyOpen: false,
});

function resetFilters() {
  filters.value.desiredBeds = 0;
  filters.value.withToiletsOnly = false;
  filters.value.favoritesOnly = false;
  filters.value.minAltitude = 0;
  filters.value.maxAltitude = 5000;
  filters.value.onlyOpen = false;
}

/**
 * Computed property that filters the list of bivouacs based on user-selected criteria.
 * 
 * @returns {Bivouac[]} Array of filtered bivouac objects that match all active filter criteria
 */
const filteredBivouacs = computed(() => {
  return bivouacs.value.filter(bivouac => {
    if (bivouac.capacity !== undefined && bivouac.capacity < filters.value.desiredBeds) {
      return false;
    }

    if (filters.value.withToiletsOnly && !bivouac.hasToilets) {
      return false;
    }

    if (filters.value.favoritesOnly && !bivouac.favorite) {
      return false;
    }

    if (bivouac.altitude !== undefined) {
      if (bivouac.altitude < filters.value.minAltitude || bivouac.altitude > filters.value.maxAltitude) {
        return false;
      }
    }
    if (filters.value.onlyOpen) {
      const today = new Date();
      if (bivouac.openDate && bivouac.closeDate) {
        if (today < bivouac.openDate || today > bivouac.closeDate) {
          return false;
        }
      } else {
        return true; // If no open/close dates are defined, consider it always open
      }
    }
    return true;
  });
});
</script>

<template>
  <div class="bar flex items-center gap-4 mb-4">
    <FilterBar :filters="filters" @reset="resetFilters" />
  </div>
  <div v-for="bivouac in filteredBivouacs" :key="bivouac.id">
    <BivouacCard :bivouac="bivouac" />
  </div>
</template>
