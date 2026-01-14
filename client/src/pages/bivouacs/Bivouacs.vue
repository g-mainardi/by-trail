<script setup lang="ts">
import {
  useBivouacStore,
  type Bivouac,
  type BivouacResponse,
} from '@/stores/bivouacs';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FilterBar from '../filterbar/FilterBar.vue';
import {
  filters,
  getFilteredBivouacs,
  resetFilters,
} from '../filterbar/filters';
import BivouacCard from './BivouacCard.vue';
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

const filteredBivouacs = computed(() => {
  return getFilteredBivouacs(bivouacs.value);
});
</script>

<template>
  <FilterBar :filters="filters" @reset="resetFilters" />
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-0">
    <div v-for="bivouac in filteredBivouacs" :key="bivouac._id" class="mt-0">
      <BivouacCard :bivouac="bivouac" />
    </div>
  </div>
</template>
