<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import H2 from '@/layouts/typography/H2.vue';
import { placeholderBivouac } from '@/services/placeholders';
import type { Bivouac } from '@by-trail/shared';
import { X } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps<{
  bivouac: Bivouac;
}>();
</script>

<template>
  <Card class="p-4 gap-4">
    <RouterLink
      :to="`/bivouac/${bivouac._id}`"
      aria-label="View Bivouac Details"
    >
      <CardTitle class="flex flex-col">
        <div class="relative w-full mb-2">
          <img
            :src="placeholderBivouac"
            :alt="`${bivouac.name} image`"
            class="w-full rounded-sm object-cover"
          />
        </div>
        <H2>{{ bivouac.name }}</H2>
      </CardTitle>
    </RouterLink>

    <CardContent class="px-0 gap-2 flex flex-col md:justify-between">
      <Button variant="destructive" @click="$emit('remove', bivouac._id)">
        <X />
        {{ t('remove') }}
      </Button>
    </CardContent>
  </Card>
</template>

<i18n>
{
  "en": {
    "no_description_available": "No description available",
    "remove": "Remove"
  },
  "it": {
    "no_description_available": "Nessuna descrizione disponibile",
    "remove": "Rimuovi"
  },
  "es": {
    "no_description_available": "No hay descripción disponible",
    "remove": "Eliminar"
  }
}
</i18n>
