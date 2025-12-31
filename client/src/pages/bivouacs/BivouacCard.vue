<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle
} from '@/components/ui/card';
import ThiigsIcon from '@/components/ui/icons/ThiigsIcon.vue';
import type { Bivouac } from '@/stores/bivouacs';
import { ArrowUpRight as ArrowUpRightIcon, Eye as EyeIcon } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

const hoodHousePath = new URL('@/assets/trekking_hood_house.png', import.meta.url).href;
const mountainHouse = new URL('@/assets/trekking_mountain_house.png', import.meta.url).href;
const tentSiteIcon = new URL('@/assets/trekking_tent.png', import.meta.url).href;
const cliffHouseIcon = new URL('@/assets/trekking_cliff_house.png', import.meta.url).href;
const mountain = new URL('@/assets/mountain.png', import.meta.url).href;
const beds = new URL('@/assets/beds.png', import.meta.url).href;
const toilet = new URL('@/assets/toilet.png', import.meta.url).href;
const calendar = new URL('@/assets/calendar.png', import.meta.url).href;

const props = defineProps<{
  bivouac: Bivouac
}>();

const bivouac = props.bivouac;

function getIconPath() {
  return hoodHousePath;
}
</script>

<template>
  <Card class="gap-4 p-4">
    <CardTitle class="flex items-center gap-4">
      <ThiigsIcon :alt="'bivouac icon'" :path="getIconPath()" :size="6" />

      <h1 class="text-2xl font-bold">
        {{ bivouac.name }}
      </h1>

      <div class="icons-wrapper ml-auto flex justify-evenly gap-4">
        <div class="icon1 flex flex-col">
          <ThiigsIcon :path="mountain" :size="4" />
          <span class="text-center font-mono text-sm">
            {{ bivouac.altitude }}
          </span>
        </div>

        <div class="icon2 flex flex-col">
          <ThiigsIcon :path="beds" :size="4" />
          <span class="text-center font-mono text-sm">
            {{ bivouac.capacity }}
          </span>
        </div>
      </div>
    </CardTitle>
    <CardContent class="flex flex-col md:flex-row gap-4 justify-between p-0">
      <!-- Description -->
      <span class="description text-sm md:text-base flex-1 flex items-center">
        <span v-if="!bivouac.note">
          {{ t('no_description_available') }}
        </span>
        <span v-else>
          {{ bivouac.note }}
        </span>
      </span>
    </CardContent>
    <CardFooter class="flex gap-4 px-0">
      <Button class="flex-1">
        <EyeIcon />
        <span class="hidden md:inline">{{ t('view') }}</span>
      </Button>
      <!-- <Button variant="secondary" class="flex-1" @click="$emit('toggle-favorite', bivouac._id)">
        <HeartIcon
          :fill="bivouac.favorite ? 'red' : 'none'"
          :color="bivouac.favorite ? 'red' : 'currentColor'"
        />
        <span class="hidden md:inline">{{ t('favorite') }}</span>
      </Button> -->
      <Button variant="outline" class="flex-1">
        <ArrowUpRightIcon />
        <span class="hidden md:inline">{{ t('plan') }}</span>
      </Button>
    </CardFooter>

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