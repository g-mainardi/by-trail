<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import ThiigsIcon from '@/components/ui/icons/ThiigsIcon.vue';
import H2 from '@/layouts/typography/H2.vue';
import type { Bivouac } from '@/stores/bivouacs';
import {
  ArrowUpRight as ArrowUpRightIcon,
  Bed as BedIcon,
  Eye as EyeIcon,
  MapPin as MapPinIcon,
  Mountain as MountainIcon,
  ThumbsUp as ThumbsUpIcon,
  Toilet as ToiletIcon,
} from 'lucide-vue-next';
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
  <Card class="gap-0 p-4">
    <CardTitle class="flex flex-col md:flex-row md:items-center gap-4">
      <ThiigsIcon :alt="'bivouac icon'" :path="getIconPath()" :size="4" />

      <H2 :text="bivouac.name" />

      <div
        class="icons-wrapper flex flex-wrap gap-4 md:ml-auto justify-start md:justify-evenly px-2"
      >
        <MountainIcon />
        <span class="flex items-center justify-center">
          {{ bivouac.altitude }}
        </span>
        <BedIcon />
        <span class="flex items-center justify-center">
          {{ bivouac.capacity }}
        </span>
        <ToiletIcon />
        <span class="flex items-center justify-center"> N/A </span>
        <MapPinIcon />
        <span class="flex items-center justify-center"> N/A </span>
        <ThumbsUpIcon />
        <span class="flex items-center justify-center">
          {{ bivouac.likes }}
        </span>
      </div>
    </CardTitle>
    <CardContent class="flex flex-col md:flex-row gap-4 p-0">
      <span
        class="description text-sm md:text-base flex-1 flex items-center px-2"
      >
        <span v-if="!bivouac.note">
          {{ t('no_description_available') }}
        </span>
        <span v-else>
          {{ bivouac.note }}
        </span>
      </span>

      <Button class="self-center">
        <EyeIcon /> <span class="hidden md:inline">{{ t('view') }}</span>
      </Button>

      <Button variant="outline" class="self-center">
        <ArrowUpRightIcon />
        <span class="hidden md:inline">{{ t('plan') }}</span>
      </Button>
    </CardContent>
    <CardFooter class="px-0"> </CardFooter>
  </Card>
</template>

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
