<script setup lang="ts">
import { useBivouacStore } from '@/stores/bivouacs';
// todo: change to type from '@/types' when store is updated
import { useFavoriteStore } from '@/stores/favorites';
import type { Bivouac as RealBivouac } from '@/types';
import { computed, onMounted, ref } from 'vue';
import FilterBar from '../filterbar/FilterBar.vue';
import {
  bivouacFilters,
  getFilteredBivouacs,
  resetBivouacFilters,
  resetRoutesFilters,
  routeFilters,
} from '../filterbar/filters';
import BivouacCard from './BivouacCard.vue';

const bivouacStore = useBivouacStore();

const favoritesStore = useFavoriteStore();
const favorites = ref<RealBivouac[]>([]);

const isFavorite = (bivouacId: string): boolean => {
  return favorites.value.some((bivouac) => bivouac._id === bivouacId);
};

const toggleFavorite = async (bivouacId: string) => {
  let res: { success: boolean; error?: string } = {
    success: false,
  };
  if (isFavorite(bivouacId)) {
    res = await favoritesStore.removeFavoriteBivouac(bivouacId);
  } else {
    res = await favoritesStore.addFavoriteBivouac(bivouacId);
  }
  if (res.success) favorites.value = await favoritesStore.getFavoriteBivouacs();
  else console.log(res.error);
};

onMounted(async () => {
  await bivouacStore.fetchBivouacs();
});

const filteredBivouacs = computed(() => {
  return getFilteredBivouacs(bivouacStore.bivouacs);
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
      <BivouacCard
        :bivouac="bivouac"
        :isFavorite="isFavorite(bivouac._id || '')"
        @toggle-favorite="toggleFavorite(bivouac._id || '')"
      />
    </div>
  </div>
</template>
