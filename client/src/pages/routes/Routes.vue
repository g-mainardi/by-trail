<script setup lang="ts">
import {
  useRouteStore,
  type RouteResponse,
  type TrekkingRoute,
} from '@/stores/routes';
import { computed, ref } from 'vue';
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

const routesResponse = ref<RouteResponse>(
  await routeStore.fetchRoutes().catch((error) => {
    console.error('Error fetching routes:', error);
    return { routes: [] };
  })
);

const routes = ref<TrekkingRoute[]>(routesResponse.value.routes);

async function fetchNextPage() {
  if (!routesResponse.value.nextPage) return;

  try {
    const response = await routeStore.fetchRoutes();
    routes.value.push(...response.routes);
    routesResponse.value.nextPage = response.nextPage;
  } catch (error) {
    console.error('Error fetching next page of routes:', error);
  }
}

const filteredRoutes = computed(() => {
  return getFilteredRoutes(routes.value);
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

  <button v-if="routesResponse.nextPage" @click="fetchNextPage">
    Load More
  </button>
</template>
