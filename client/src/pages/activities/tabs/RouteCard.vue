<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { Card, CardContent } from '@/components/ui/card';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import H2 from '@/layouts/typography/H2.vue';
import { placeholderRoute } from '@/services/placeholders';
import { type Route } from '@/types';
import { X } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  route: Route;
}>();

const route = props.route;

// Helper to determine difficulty color
</script>

<template>
  <Card class="p-4 gap-4 h-full flex flex-col justify-between">
    <RouterLink :to="`/route/${route._id}`" aria-label="View Route Details">
      <CardTitle>
        <div class="relative w-full mb-2">
          <img
            :src="placeholderRoute"
            :alt="`${route.title} image`"
            class="w-full rounded-sm object-cover"
          />
        </div>
        <H2>{{ route.title }}</H2>
      </CardTitle>
    </RouterLink>
    <CardContent class="px-0 gap-2 flex flex-col md:justify-between">
      <Button variant="destructive" @click="$emit('remove', route._id)">
        <X />
        {{ t('remove') }}
      </Button>
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
    "view": "Details",
    "plan": "Navigate",
    "difficulty": "Difficulty",
    "ascent": "Elevation Gain",
    "descent": "Elevation Loss",
    "duration": "Duration",
    "distance": "Distance",
    "routeType": "Route Type",
    "remove": "Remove"
  },
  "it": {
    "view": "Dettagli",
    "plan": "Naviga",
    "difficulty": "Difficoltà",
    "ascent": "Dislivello Positivo",
    "descent": "Dislivello Negativo",
    "duration": "Tempo",
    "distance": "Distanza",
    "routeType": "Tipo di percorso",
    "remove": "Rimuovi"
  },
  "es": {
    "view": "Detalles",
    "plan": "Navegar",
    "difficulty": "Dificultad",
    "ascent": "Desnivel Positivo",
    "descent": "Desnivel Negativo",
    "duration": "Tiempo",
    "distance": "Distancia",
    "routeType": "Tipo de ruta",
    "remove": "Eliminar"
  }
}
</i18n>
