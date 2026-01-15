<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
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
</script>

<template>
  <Card class="p-4 gap-4 h-full flex flex-col">
    <CardContent class="px-0 flex-1 flex flex-col">
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
        <H2>{{ bivouac.name }}</H2>
      </RouterLink>
      <span v-if="!bivouac.note">
        {{ t('no_description_available') }}
      </span>
      <span v-else>
        {{ bivouac.note }}
      </span>
      <div class="grid grid-cols-3 gap-2 mt-2 flex-1">
        <div class="info">
          <MountainIcon />
          <span class="value">{{ bivouac.altitude }}mt</span>
          <span class="label">Altitude</span>
        </div>
        <div class="info">
          <BedIcon />
          <span class="value">{{ bivouac.capacity }}</span>
          <span class="label">Capacity</span>
        </div>
        <div class="info">
          <ToiletIcon />
          <span class="value">N/A</span>
          <span class="label">Toilet</span>
        </div>
        <div class="info col-span-2">
          <MapPinIcon />
          <span class="value">{{ bivouac.comune }}</span>
          <span class="label">Location</span>
        </div>
        <div class="info">
          <ThumbsUpIcon />
          <span class="value">{{ bivouac.likes }}</span>
          <span class="label">Likes</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
.info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
}

.info span.value {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: monospace;
  font-size: large;
}

.info span.label {
  font-size: small;
  color: var(--muted-foreground);
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
