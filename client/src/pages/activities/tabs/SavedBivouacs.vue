<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, type Ref } from 'vue';

import type { Bivouac } from '@/stores/bivouacs';
import { useFavoriteStore } from '@/stores/favorites';

import BivouacCard from './BivouacCard.vue';
import P from '@/layouts/typography/P.vue';

const { t } = useI18n();

const favoriteStore = useFavoriteStore();

const favoriteBivouacs: Ref<Bivouac[]> = ref([]);
const isLoading = ref(true);

favoriteStore
  .getFavoriteBivouacs()
  .then((bivouacs) => {
    favoriteBivouacs.value = bivouacs;
  })
  .catch((error) => {
    console.error('Error fetching favorite bivouacs:', error);
  })
  .finally(() => {
    isLoading.value = false;
  });
</script>

<template>
  <div v-if="isLoading" class="flex justify-center p-10">
    <P>{{ t('loading_bivouacs') }}...</P>
  </div>

  <div v-else-if="favoriteBivouacs.length === 0" class="text-center p-10">
    <P>{{ t('no_saved_bivouacs') }}</P>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="bivouac in favoriteBivouacs" :key="bivouac._id">
      <BivouacCard :bivouac="bivouac" />
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "loading_bivouacs": "Loading saved bivouacs",
    "no_saved_bivouacs": "You have no saved bivouacs."
  },
  "it": {
    "loading_bivouacs": "Caricamento bivacchi salvati",
    "no_saved_bivouacs": "Non hai bivacchi salvati."
  },
  "es": {
    "loading_bivouacs": "Cargando bivouacs guardados",
    "no_saved_bivouacs": "No tienes bivouacs guardados."
  }
}
</i18n>
