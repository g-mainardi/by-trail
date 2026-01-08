<script setup lang="ts">
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import ThiigsIcon from '@/components/ui/icons/ThiigsIcon.vue';
import H2 from '@/layouts/typography/H2.vue';
import type { Bivouac } from '@/stores/bivouacs';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const hoodHousePath = new URL(
  '@/assets/trekking_hood_house.png',
  import.meta.url
).href;

const props = defineProps<{
  bivouac: Bivouac;
}>();

const bivouac = props.bivouac;

function getIconPath() {
  return hoodHousePath;
}
</script>

<template>
  <Card class="p-4 gap-4">
    <RouterLink
      :to="`/bivouac/${bivouac._id}`"
      aria-label="View Bivouac Details"
    >
      <CardTitle class="flex flex-row items-center gap-4">
        <ThiigsIcon :alt="'bivouac icon'" :path="getIconPath()" :size="4" />
        <H2>{{ bivouac.name }}</H2>
      </CardTitle>
    </RouterLink>

    <CardContent
      class="px-0 flex flex-col md:flex-row md:items-center md:justify-between"
    >
      <span class="">
        <span v-if="!bivouac.note">
          {{ t('no_description_available') }}
        </span>
        <span v-else>
          {{ bivouac.note }}
        </span>
      </span>
    </CardContent>
  </Card>
</template>

<i18n>
{
  "en": {
    "no_description_available": "No description available"
  },
  "it": {
    "no_description_available": "Nessuna descrizione disponibile"
  },
  "es": {
    "no_description_available": "No hay descripción disponible"
  }
}
</i18n>
