<script setup lang="ts">
import { useBivouacStore } from '@/stores/bivouacs';
// todo: change to type from '@by-trail/shared' when store is updated
import { useFavoriteStore } from '@/stores/favorites';
import { computed, onMounted } from 'vue';
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

onMounted(async () => {
  await bivouacStore.fetchBivouacs();
  await favoritesStore.fetchBivouacFavorites();
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
        :isFavorite="favoritesStore.isFavoriteBivouac(bivouac._id ?? '')"
        @toggle-favorite="
          favoritesStore.toggleFavoriteBivouac(bivouac._id ?? '')
        "
      />
    </div>
  </div>
</template>
