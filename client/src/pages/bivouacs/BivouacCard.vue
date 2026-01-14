<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import H2 from '@/layouts/typography/H2.vue';
import type { Bivouac } from '@/stores/bivouacs';
import {
  Bed as BedIcon,
  MapPin as MapPinIcon,
  Mountain as MountainIcon,
  ThumbsUp as ThumbsUpIcon,
  Toilet as ToiletIcon,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const imageBivouacPH1 = new URL('@/assets/bivouac-ph-1.jpg', import.meta.url)
  .href;

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
    <CardContent class="px-0">
      <div class="relative w-full mb-2">
        <img
          :src="imageBivouacPH1"
          :alt="`${bivouac.name} image`"
          class="w-full rounded-sm object-cover"
        />
      </div>
      <RouterLink
        :to="`/bivouac/${bivouac._id}`"
        aria-label="View Bivouac Details"
      >
        <!-- <ThiigsIcon :alt="'bivouac icon'" :path="getIconPath()" :size="4" /> -->
        <H2>{{ bivouac.name }}</H2>
      </RouterLink>
      <span v-if="!bivouac.note">
        {{ t('no_description_available') }}
      </span>
      <span v-else>
        {{ bivouac.note }}
      </span>
    </CardContent>
    <CardFooter class="px-0">
      <div class="flex flex-wrap gap-x-4 gap-y-2 justify-center w-full">
        <div class="icon-with-text">
          <MountainIcon />
          <span class="">
            {{ bivouac.altitude }}
          </span>
        </div>
        <div class="icon-with-text">
          <BedIcon />
          <span class="">
            {{ bivouac.capacity }}
          </span>
        </div>
        <div class="icon-with-text">
          <ToiletIcon />
          <span class=""> N/A </span>
        </div>
        <div class="icon-with-text">
          <MapPinIcon />
          <span class=""> N/A </span>
        </div>
        <div class="icon-with-text">
          <ThumbsUpIcon />
          <span class="">
            {{ bivouac.likes }}
          </span>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>

<style scoped>
.icon-with-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>

<i18n>
{
  "en": {
    "view": "View",
    "favorite": "Favorite",
    "plan": "Plan",
    "yes": "Yes",
    "no": "No",
    "open": "Open",
    "closed": "Closed",
    "no_description_available": "No description available"
  },
  "it": {
    "view": "Visualizza",
    "favorite": "Preferito",
    "plan": "Pianifica",
    "yes": "Sì",
    "no": "No",
    "open": "Aperto",
    "closed": "Chiuso",
    "no_description_available": "Nessuna descrizione disponibile"
  },
  "es": {
    "view": "Ver",
    "favorite": "Favorito",
    "plan": "Planificar",
    "yes": "Sí",
    "no": "No",
    "open": "Abierto",
    "closed": "Cerrado",
    "no_description_available": "No hay descripción disponible"
  }
}
</i18n>
