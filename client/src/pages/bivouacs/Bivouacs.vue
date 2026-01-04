<script setup lang="ts">
import H1 from '@/layouts/typography/H1.vue';
import {
  useBivouacStore,
  type Bivouac,
  type BivouacResponse,
} from '@/stores/bivouacs';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import BivouacCard from './BivouacCard.vue';
import FilterBar from './FilterBar.vue';
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
  predicate: (bivouac: Bivouac, value: any) => {
    return bivouac.capacity !== undefined ? bivouac.capacity >= value : true;
  },
};

const altitudeFilter: Filter = {
  currentValue: { min: 0, max: 10000 },
  default: { min: 0, max: 10000 },
  predicate: (bivouac: Bivouac, value: any) => {
    const altitude = bivouac.altitude;
    if (altitude !== undefined) {
      return altitude >= value.min && altitude <= value.max;
    }
    return true;
  },
};

const filters = ref({
  minDesiredBeds: minDesiredBeds,
  altitudeFilter: altitudeFilter,
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
  <H1 :text="t('bivouacs')" />
  <div class="flex justify-end">
    <FilterBar :filters="filters" @reset="resetFilters" />
  </div>
  <div v-for="bivouac in filteredBivouacs" :key="bivouac._id">
    <BivouacCard :bivouac="bivouac" @toggle-favorite="toggleFavorite" />
  </div>
</template>

<i18n>
  {
    "en": {
      "bivouacs": "Bivouacs & Shelters"
    },
    "it": {
      "bivouacs": "Bivacchi & Rifugi"
    },
    "es": {
      "bivouacs": "Vivacs & Refugios"
    }
  }
</i18n>
