<script setup lang="ts">
import { useBivouacStore, type Bivouac } from '@/stores/bivouacs';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FilterBar from '../filterbar/FilterBar.vue';
import {
  bivouacFilters,
  getFilteredBivouacs,
  resetBivouacFilters,
  resetRoutesFilters,
  routeFilters,
} from '../filterbar/filters';
import BivouacCard from './BivouacCard.vue';
const { t } = useI18n();

const bivouacStore = useBivouacStore();
const bivouacs = ref<Bivouac[]>([]);
const nextPage = ref<string | undefined>(undefined);
const isLoading = ref(true);

const loadBivouacs = async () => {
  isLoading.value = true;
  try {
    const response = await bivouacStore.fetchBivouacs();
    bivouacs.value = response.bivouacs;
    nextPage.value = response.nextPage;
  } catch (error) {
    console.error('Error fetching bivouacs:', error);
    bivouacs.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadBivouacs();
});

async function fetchNextPage() {
  if (!nextPage.value) {
    return;
  }
  try {
    const response = await bivouacStore.fetchBivouacs({}, nextPage.value);
    bivouacs.value.push(...response.bivouacs);
    nextPage.value = response.nextPage;
  } catch (error) {
    console.error('Error fetching next page of bivouacs:', error);
  }
}

const filteredBivouacs = computed(() => {
  return getFilteredBivouacs(bivouacs.value);
});
</script>

<template>
  <FilterBar
    :bivouacFilters="bivouacFilters"
    :routeFilters="routeFilters"
    @resetBivouacFilters="resetBivouacFilters"
    @resetRouteFilters="resetRoutesFilters"
  />
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-0">
    <div v-for="bivouac in filteredBivouacs" :key="bivouac._id" class="mt-0">
      <BivouacCard :bivouac="bivouac" />
    </div>
  </div>
</template>
