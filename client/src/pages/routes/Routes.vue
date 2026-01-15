<script setup lang="ts">
import { useRouteStore, type TrekkingRoute } from '@/stores/routes';
import { computed, onMounted, ref } from 'vue';
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
const routes = ref<TrekkingRoute[]>([]);
const nextPage = ref<string | undefined>(undefined);
const isLoading = ref(false);

const loadRoutes = async () => {
  isLoading.value = true;
  try {
    const response = await routeStore.fetchRoutes();
    routes.value = response.routes;
    nextPage.value = response.nextPage;
  } catch (error) {
    console.error('Error fetching routes:', error);
    routes.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadRoutes();
});

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
</template>
