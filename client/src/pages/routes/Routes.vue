<script setup lang="ts">
import { useRouteStore, type TrekkingRoute, type RouteResponse } from '@/stores/routes';
import { computed, ref } from 'vue';
import RouteCard from './RouteCard.vue';
import FilterBar from './FilterBar.vue';

const routeStore = useRouteStore();

const routesResponse = ref<RouteResponse>(
  await routeStore.fetchRoutes().catch(error => {
    console.error('Error fetching routes:', error);
    return { routes: [] };
  })
);

console.log("Raw Routes from Server:", routesResponse.value.routes);

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

function toggleFavorite(routeId: number) {
  // TODO
  console.log('Not implemented yet: toggleFavorite for routeId', routeId);
}

export interface Filter {
  currentValue?: any;
  default: any;
  predicate: (route: TrekkingRoute, value: any) => boolean;
}

// Filter 1: Max Duration
const maxDurationFilter: Filter = {
  currentValue: 24,
  default: 24,
  predicate: (route: TrekkingRoute, value: any) => {
    if (route.duration !== undefined) {
      return (route.duration / 60) <= value;
    }
    return true;
  },
};

// Filter 2: Difficulty
const difficultyFilter: Filter = {
  currentValue: 'All',
  default: 'All',
  predicate: (route: TrekkingRoute, value: any) => {
    if (value === 'All') return true; 
    return route.difficulty === value;
  },
};

const filters = ref({
  maxDuration: maxDurationFilter,
  difficulty: difficultyFilter,
})

function resetFilters() {
  Object.values(filters.value).forEach(filter => {
    filter.currentValue = JSON.parse(JSON.stringify(filter.default));
  });
}

/**
 * Computed property that filters the list of routes based on user-selected criteria.
 * 
 * @returns {Route[]} Array of filtered bivouac objects that match all active filter criteria
 */
const filteredRoutes = computed(() => {
  return routes.value.filter(route => {
    return Object.values(filters.value).every(filter => filter.predicate(route, filter.currentValue));
  });
});
</script>

<template>
  <div class="bar flex items-center">
    <FilterBar :filters="filters" @reset="resetFilters" />
  </div>

  <div v-if="filteredRoutes.length > 0" class="grid-container">
    <div v-for="route in filteredRoutes" :key="route._id">
      <RouteCard :route="route" @toggle-favorite="toggleFavorite" />
    </div>
  </div>

  <div v-else class="no-results">
    <p>No routes found matching your criteria.</p>
  </div>

  <button v-if="routesResponse.nextPage" @click="fetchNextPage">Load More</button>
</template>
