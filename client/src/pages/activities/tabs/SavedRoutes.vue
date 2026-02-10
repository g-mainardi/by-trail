<script setup lang="ts">
import { useFavoriteStore } from '@/stores/favorites';
import { type Route } from '@by-trail/shared';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import P from '@/layouts/typography/P.vue';
import RouteCard from './RouteCard.vue';

const { t } = useI18n();

const favoriteStore = useFavoriteStore();

const favoriteRoutes = ref<Route[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  try {
    await favoriteStore.fetchFavoriteRoutes();
    favoriteRoutes.value = favoriteStore.routeFavorites;
  } catch (error: any) {
    console.error('Error fetching favorite routes:', error);
  } finally {
    isLoading.value = false;
  }
});

async function handleRemove(id: string | undefined) {
  if (!id) return;
  await favoriteStore.deleteFavoriteRoute(id);
  await favoriteStore.fetchFavoriteRoutes();
  favoriteRoutes.value = favoriteStore.routeFavorites;
}
</script>

<template>
  <div v-if="isLoading" class="flex justify-center p-10">
    <P>{{ t('loading_routes') }}...</P>
  </div>

  <div v-else-if="favoriteRoutes.length === 0" class="text-center p-10">
    <P>{{ t('no_saved_routes') }}</P>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="route in favoriteRoutes" :key="route._id">
      <RouteCard :route="route" @remove="handleRemove(route._id)" />
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "loading_routes": "Loading saved routes",
    "no_saved_routes": "You have no saved routes."
  },
  "it": {
    "loading_routes": "Caricamento percorsi salvati",
    "no_saved_routes": "Non hai percorsi salvati."
  },
  "es": {
    "loading_routes": "Cargando rutas guardadas",
    "no_saved_routes": "No tienes rutas guardadas."
  }
}
</i18n>
