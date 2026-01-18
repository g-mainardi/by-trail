<script setup lang="ts">
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

onMounted(async () => {
  await routeStore.fetchRoutes();
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
      <RouteCard :route="route" />
    </div>
  </div>
  <div v-else class="no-results">
    <p>No routes found matching your criteria.</p>
  </div>
</template>
