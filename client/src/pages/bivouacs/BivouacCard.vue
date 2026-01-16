<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import H2 from '@/layouts/typography/H2.vue';
import type { Bivouac } from '@/stores/bivouacs';
import { useFavoriteStore } from '@/stores/favorites';
import {
  Bed as BedIcon,
  Heart as HeartIcon,
  MapPin as MapPinIcon,
  Mountain as MountainIcon,
  Toilet as ToiletIcon,
} from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const favoritesStore = useFavoriteStore();
const favorites = ref<Bivouac[]>();

const isFavorite = (bivouacId: string) => {
  return favorites.value?.some((bivouac) => bivouac._id === bivouacId);
};

const toggleFavorite = async (bivouacId: string) => {
  if (isFavorite(bivouacId)) {
    await favoritesStore.removeFavoriteBivouac(bivouacId);
  } else {
    await favoritesStore.addFavoriteBivouac(bivouacId);
  }
  favorites.value = await favoritesStore.getFavoriteBivouacs();
};

onMounted(async () => {
  favorites.value = await favoritesStore.getFavoriteBivouacs();
});

const props = defineProps<{
  bivouac: Bivouac;
}>();

const placeholder = new URL('@/assets/placeholder.jpg', import.meta.url).href;
</script>

<template>
  <Card class="p-4 gap-4 h-full flex flex-col">
    <CardContent class="px-0 flex-1 flex flex-col">
      <div class="relative w-full mb-2">
        <img
          :src="placeholder"
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
          <HeartIcon
            :color="
              isFavorite(bivouac._id)
                ? 'var(--primary)'
                : 'var(--muted-foreground)'
            "
            :fill="
              isFavorite(bivouac._id) ? 'var(--primary)' : 'var(--background)'
            "
            class="transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
            @click="toggleFavorite(bivouac._id)"
          />
          <span class="value">{{
            isFavorite(bivouac._id) ? t('saved') : t('unsaved')
          }}</span>
          <span class="label">{{ t('favorites') }}</span>
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
    "saved": "Saved",
    "unsaved": "Unsaved",
    "favorites": "Favorites",
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
    "saved": "Salvato",
    "unsaved": "Non salvato",
    "favorites": "Preferiti",
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
    "saved": "Guardado",
    "unsaved": "No guardado",
    "favorites": "Favoritos",
    "open": "Abierto",
    "closed": "Cerrado",
    "no_description_available": "No hay descripción disponible"
  }
}
</i18n>
