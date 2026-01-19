<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAdminStore } from '@/stores/admin';
import { storeToRefs } from 'pinia';
import type { Route } from '@/types';

import Spinner from '@/components/ui/spinner/Spinner.vue';
import { AlertCircle, CheckCircle } from 'lucide-vue-next';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-vue-next';

import DataTable from '@/components/ui/data-table/DataTable.vue';
import RouteActions from './RoutesActions.vue';
import RouteEditSheet from './RoutesEditSheet.vue';

const { t } = useI18n();
const adminStore = useAdminStore();
const { isLoading, routes } = storeToRefs(adminStore);
const feedbackMessage = ref('');
const isError = ref(false);

// State for Edit Sheet
const isEditOpen = ref(false);
const selectedRoute = ref<Route | null>(null);

onMounted(() => {
  adminStore.fetchRoutes();
});

const getRouteId = (b: Route) => b.id || b._id || '';

// --- Handlers ---

const onOpenEdit = (id: string) => {
  const route = routes.value.find((b) => getRouteId(b) === id);
  if (route) {
    selectedRoute.value = route;
    isEditOpen.value = true;
  }
};

const onDeleteRoute = async (id: string) => {
  if (confirm(t('confirm_delete'))) {
    const success = await adminStore.deleteRoute(id);
    if (success) {
      feedbackMessage.value = t('changes_saved');
      isError.value = false;
    } else {
      isError.value = true;
      feedbackMessage.value = t('error_occurred');
    }
  }
};

const handleSave = async (payload: { id: string; updates: Partial<Route> }) => {
  feedbackMessage.value = '';
  isError.value = false;
  if (!payload.updates || Object.keys(payload.updates).length === 0) {
    return;
  }
  if (payload.id === '') {
    isError.value = true;
    feedbackMessage.value = t('error_occurred');
    return;
  }
  const success = await adminStore.updateRoute(payload.id, payload.updates);
  if (success) {
    feedbackMessage.value = t('changes_saved');
    isError.value = false;
    await adminStore.fetchRoutes();
  } else {
    isError.value = true;
    feedbackMessage.value = t('error_occurred');
  }
};

const updateAlertMessage = (payload: { error: boolean; message: string }) => {
  isError.value = payload.error;
  feedbackMessage.value = payload.message;
};

const alertConfig = computed(() => {
  if (isError.value) {
    return {
      variant: 'destructive' as const,
      icon: AlertCircle,
    };
  }
  return {
    variant: 'success' as const,
    icon: CheckCircle,
  };
});

// --- Columns ---
const columns = [
  {
    header: t('title'),
    accessorKey: 'title',
  },
  {
    header: t('region'),
    accessorKey: 'region',
  },
  {
    header: t('difficulty'),
    accessorKey: 'difficulty',
  },
  {
    header: t('distance'),
    accessorKey: 'distance',
  },
  {
    header: t('ascent'),
    accessorKey: 'ascent',
  },
  {
    header: t('descent'),
    accessorKey: 'descent',
  },
  {
    header: t('duration'),
    accessorKey: 'duration',
  },
  {
    header: t('route_type'),
    accessorKey: 'routeType',
  },
  {
    header: t('path_type'),
    accessorKey: 'path',
  },
  {
    header: t('note'),
    accessorKey: 'note',
  },
  {
    header: t('actions'),
    accessorKey: 'actions',
  },
];
</script>

<template>
  <div class="space-y-4">
    <Spinner v-if="isLoading" />
    <Alert
      v-else-if="feedbackMessage"
      :variant="alertConfig.variant"
      class="mb-6"
    >
      <component :is="alertConfig.icon" />
      <AlertTitle>{{ feedbackMessage }}</AlertTitle>
    </Alert>
    <DataTable
      :columns="columns"
      :data="routes"
      search-key="title"
      :search-key-label="t('title')"
    >
      <template #header-title="{ column }">
        <Button
          variant="ghost"
          class="pl-0 hover:bg-transparent"
          @click="column.toggleSorting(column.getIsSorted() === 'asc')"
        >
          {{ t('title') }}
          <ArrowUpDown class="ml-2 h-4 w-4" />
        </Button>
      </template>
      <template #cell-title="{ row }">
        <span class="font-medium pl-4">{{ row.title }}</span>
      </template>

      <template #cell-distance="{ row }"> {{ row.distance }} m </template>
      <template #cell-ascent="{ row }"> {{ row.ascent }} m </template>
      <template #cell-descent="{ row }"> {{ row.descent }} m </template>
      <template #cell-duration="{ row }"> {{ row.duration }} min </template>
      <template #cell-path="{ row }">
        {{ row.path ? row.path.type : '' }}
      </template>
      <template #cell-actions="{ row }">
        <RouteActions :route="row" @edit="onOpenEdit" @delete="onDeleteRoute" />
      </template>
    </DataTable>

    <RouteEditSheet
      v-model:open="isEditOpen"
      :route="selectedRoute"
      @save="handleSave"
      @update:message="updateAlertMessage"
    />
  </div>
</template>
<i18n>
{
  "en": {
    "title": "Title",
    "region": "Region",
    "difficulty": "Difficulty",
    "distance": "Distance",
    "ascent": "Ascent",
    "descent": "Descent",
    "duration": "Duration",
    "type": "Type",
    "route_type": "Route Type",
    "path": "Path",
    "note": "Note",
    "actions": "Actions",
    "path_type": "Path Type",
    "confirm_delete": "Are you sure you want to delete this route?",
    "changes_saved": "Changes have been saved successfully.",
    "error_occurred": "An error occurred while processing your request."
  },
  "it": {
    "title": "Titolo",
    "region": "Regione",
    "difficulty": "Difficoltà",
    "distance": "Distanza",
    "ascent": "Dislivello in salita",
    "descent": "Dislivello in discesa",
    "duration": "Durata",
    "type": "Tipo",
    "route_type": "Tipo di Percorso",
    "path": "Sentiero",
    "note": "Nota",
    "actions": "Azioni",
    "path_type": "Tipo di Sentiero",
    "confirm_delete": "Sei sicuro di voler eliminare questo percorso?",
    "changes_saved": "Le modifiche sono state salvate con successo.",
    "error_occurred": "Si è verificato un errore durante l'elaborazione della tua richiesta."
  },
  "es": {
    "title": "Título",
    "region": "Región",
    "difficulty": "Dificultad",
    "distance": "Distancia",
    "ascent": "Ascenso",
    "descent": "Descenso",
    "duration": "Duración",
    "type": "Tipo",
    "route_type": "Tipo de Ruta",
    "path": "Camino",
    "note": "Nota",
    "actions": "Acciones",
    "path_type": "Tipo de Camino",
    "confirm_delete": "¿Estás seguro de que deseas eliminar esta ruta?",
    "changes_saved": "Los cambios se han guardado con éxito.",
    "error_occurred": "Ocurrió un error al procesar su solicitud."
  }
}
</i18n>
