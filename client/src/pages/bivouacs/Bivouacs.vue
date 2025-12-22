<script setup lang="ts">
import { useBivouacStore, type Bivouac } from '@/stores/bivouacs';
import { computed, ref } from 'vue';
import BivouacCard from './BivouacCard.vue';
import FilterBar from './FilterBar.vue';

const bivouacStore = useBivouacStore();
const bivouacsResponse = await bivouacStore.fetchBivouacs();
let bivouacs = ref<Bivouac[]>(bivouacsResponse.bivouacs);

function fetchNextPage() {
  if (bivouacsResponse.nextPage) {
    bivouacStore.fetchBivouacs({}, bivouacsResponse.nextPage).then(response => {
      bivouacs.value.push(...response.bivouacs);
      bivouacsResponse.nextPage = response.nextPage;
    });
  }
}

// TODO: move isOpen calculation to the store
// bivouacs.value.forEach(bivouac => {
//   bivouac.isOpen = isOpen(bivouac.openDate!, bivouac.closeDate!);
// });

// function isOpen(openDate: Date, closeDate: Date): boolean {
//   const today = new Date();
//   if (!openDate || !closeDate) {
//     return true; // Always open if no dates defined
//   }
//   return today >= openDate && today <= closeDate;
// }

function toggleFavorite(bivouacId: number) {

  // const bivouac = bivouacs.value.find(b => b.id === bivouacId);
  // if (bivouac) {
  //   bivouac.favorite = !bivouac.favorite;
  // }
}

export interface Filter {
  currentValue?: any;
  default: any;
  predicate: (bivouac: Bivouac, value: any) => boolean;
}

const minDesiredBeds: Filter = {
  currentValue: 0,
  default: 0,
  predicate: (bivouac: Bivouac, value: any) => {
    return bivouac.capacity !== undefined ? bivouac.capacity >= value : true;
  },
};

const altitudeFilter: Filter = {
  currentValue: { min: 0, max: 10000 },
  default: {
    min: 0,
    max: 10000
  },
  predicate: (bivouac: Bivouac, value: any) => {
    if (bivouac.altitude !== undefined) {
      return bivouac.altitude >= value.min 
        && bivouac.altitude <= value.max;
    }
    return true;
  },
};


const filters = ref({
  minDesiredBeds: minDesiredBeds,
  altitudeFilter: altitudeFilter,
})

// const filters = ref({
//   desiredBeds: 0,
//   withToiletsOnly: false,
//   favoritesOnly: false,
//   minAltitude: 0,
//   maxAltitude: 5000,
//   onlyOpen: false,
// });

function resetFilters() {
  Object.values(filters.value).forEach(filter => {
    filter.currentValue = structuredClone(filter.default);
  });
}

/**
 * Computed property that filters the list of bivouacs based on user-selected criteria.
 * 
 * @returns {Bivouac[]} Array of filtered bivouac objects that match all active filter criteria
 */
const filteredBivouacs = computed(() => {
  return bivouacs.value.filter(bivouac => {
    return Object.values(filters.value).every(filter => filter.predicate(bivouac, filter.currentValue));
  });
});
</script>

<template>
  <div class="bar flex items-center">
    <FilterBar :filters="filters" @reset="resetFilters" />
  </div>
  <div v-for="bivouac in filteredBivouacs" :key="bivouac._id">
    <BivouacCard :bivouac="bivouac" @toggle-favorite="toggleFavorite" />
  </div>
</template>
