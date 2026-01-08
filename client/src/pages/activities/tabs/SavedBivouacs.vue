<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

import type { Bivouac } from '@/stores/bivouacs';
import { useFavoriteStore } from '@/stores/favorites';

import BivouacCard from './BivouacCard.vue';

const { t } = useI18n();

const favoriteStore = useFavoriteStore();
const favoriteBivouacsResponse = ref(
  await favoriteStore.getFavoriteBivouacs().catch((error) => {
    console.error('Error fetching favorite bivouacs:', error);
    return { bivouacs: [] };
  })
);
const favoriteBivouacs = ref<Bivouac[]>(
  favoriteBivouacsResponse.value.bivouacs
);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="bivouac in favoriteBivouacs" :key="bivouac._id">
      <BivouacCard :bivouac="bivouac" />
    </div>
  </div>
</template>

<i18n>
{
  "en": {
  },
  "it": {
  },
  "es": {
  }
}
</i18n>
