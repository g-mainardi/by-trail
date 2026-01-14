<script setup lang="ts">
import {
  useBivouacStore,
  type Bivouac,
  type BivouacResponse,
} from '@/stores/bivouacs';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BivouacCard from './BivouacCard.vue';
import FilterBar from './BivouacFilterBar.vue';
const { t } = useI18n();

const bivouacStore = useBivouacStore();
const bivouacsResponse = ref<BivouacResponse>(
  await bivouacStore.fetchBivouacs().catch((error) => {
    console.error('Error fetching bivouacs:', error);
    return { bivouacs: [] };
  })
);

const bivouacs = ref<Bivouac[]>(bivouacsResponse.value.bivouacs);

async function fetchNextPage() {
  if (!bivouacsResponse.value.nextPage) {
    return;
  }
  try {
    const response = await bivouacStore.fetchBivouacs(
      {},
      bivouacsResponse.value.nextPage
    );
    bivouacs.value.push(...response.bivouacs);
    bivouacsResponse.value.nextPage = response.nextPage;
  } catch (error) {
    console.error('Error fetching next page of bivouacs:', error);
  }
}

function toggleFavorite(bivouacId: number) {
  // TODO
  console.log('Not implemented yet: toggleFavorite for bivouacId', bivouacId);
}

export interface Filter {
  currentValue?: any;
  default: any;
  predicate: (bivouac: Bivouac, value: any) => boolean;
}

const minDesiredBeds: Filter = {
  currentValue: 0,
  default: 0,
  predicate: (bivouac: Bivouac, value: number) => {
    return bivouac.capacity !== undefined ? bivouac.capacity >= value : true;
  },
};

const altitudeFilter: Filter = {
  currentValue: { min: 0, max: 10000 },
  default: { min: 0, max: 10000 },
  predicate: (bivouac: Bivouac, value: { min: number; max: number }) => {
    const altitude = bivouac.altitude;
    if (altitude !== undefined) {
      return altitude >= value.min && altitude <= value.max;
    }
    return true;
  },
};

const searchQuery: Filter = {
  currentValue: '',
  default: '',
  predicate: (bivouac: Bivouac, value: string) => {
    if (!value) return true;
    const query = value.toLowerCase();
    return (
      bivouac.name.toLowerCase().includes(query) ||
      (bivouac.note !== undefined && bivouac.note.toLowerCase().includes(query))
    );
  },
};

const filters = ref({
  minDesiredBeds: minDesiredBeds,
  altitudeFilter: altitudeFilter,
  searchQuery: searchQuery,
});

function resetFilters() {
  Object.values(filters.value).forEach((filter) => {
    filter.currentValue = JSON.parse(JSON.stringify(filter.default));
  });
}

/**
 * Computed property that filters the list of bivouacs based on user-selected criteria.
 *
 * @returns {Bivouac[]} Array of filtered bivouac objects that match all active filter criteria
 */
const filteredBivouacs = computed(() => {
  return bivouacs.value.filter((bivouac) => {
    return Object.values(filters.value).every((filter) =>
      filter.predicate(bivouac, filter.currentValue)
    );
  });
});
</script>

<template>
  <FilterBar :filters="filters" @reset="resetFilters" />
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-0">
    <div v-for="bivouac in filteredBivouacs" :key="bivouac._id" class="mt-0">
      <BivouacCard :bivouac="bivouac" @toggle-favorite="toggleFavorite" />
    </div>
  </div>
</template>
