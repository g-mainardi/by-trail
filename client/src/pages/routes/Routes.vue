<script setup lang="ts">
import { useFavoriteStore } from '@/stores/favorites';
import { useRouteStore } from '@/stores/routes';
import { computed, onMounted } from 'vue';
import FilterBar from '../filterbar/FilterBar.vue';
import {
  bivouacFilters,
  getFilteredRoutes,
  resetBivouacFilters,
  resetRoutesFilters,
  routeFilters,
} from '../filterbar/filters';
import RouteCard from './RouteCard.vue';

const routeStore = useRouteStore();
const favoriteStore = useFavoriteStore();

onMounted(async () => {
  await routeStore.fetchRoutes();
  await favoriteStore.fetchFavoriteRoutes();
});

const filteredRoutes = computed(() => {
  return getFilteredRoutes(routeStore.routes);
});
</script>

<template>
  <FilterBar
    :bivouacFilters="bivouacFilters"
    :routeFilters="routeFilters"
    @resetBivouacFilters="resetBivouacFilters"
    @resetRouteFilters="resetRoutesFilters"
  />
  <div
    v-if="filteredRoutes.length > 0"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-0"
  >
    <div v-for="route in filteredRoutes" :key="route._id">
      <RouteCard
        :route="route"
        :isFavorite="favoriteStore.isFavoriteRoute(route._id ?? '')"
        @toggle-favorite="favoriteStore.toggleFavoriteRoute"
      />
    </div>
  </div>
  <div v-else class="no-results">
    <p></p>
  </div>
</template>
