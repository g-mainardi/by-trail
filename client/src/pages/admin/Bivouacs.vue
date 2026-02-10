<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAdminStore } from '@/stores/admin';
import { storeToRefs } from 'pinia';
import type { Bivouac } from '@by-trail/shared';

import Spinner from '@/components/ui/spinner/Spinner.vue';
import { AlertCircle, CheckCircle } from 'lucide-vue-next';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-vue-next';

import DataTable from '@/components/ui/data-table/DataTable.vue';
import BivouacActions from './BivouacsActions.vue';
import BivouacEditSheet from './BivouacsEditSheet.vue';

const { t } = useI18n();
const adminStore = useAdminStore();
const { isLoading, bivouacs } = storeToRefs(adminStore);
const feedbackMessage = ref('');
const isError = ref(false);

// State for Edit Sheet
const isEditOpen = ref(false);
const selectedBivouac = ref<Bivouac | null>(null);

onMounted(() => {
  adminStore.fetchBivouacs();
});

const getBivouacId = (b: Bivouac) => b._id ?? '';

// --- Handlers ---

const onOpenEdit = (id: string) => {
  const bivouac = bivouacs.value.find((b) => getBivouacId(b) === id);
  if (bivouac) {
    selectedBivouac.value = bivouac;
    isEditOpen.value = true;
  }
};

const onDeleteBivouac = async (id: string) => {
  if (confirm(t('confirm_delete'))) {
    const success = await adminStore.deleteBivouac(id);
    if (success) {
      feedbackMessage.value = t('changes_saved');
      isError.value = false;
    } else {
      isError.value = true;
      feedbackMessage.value = t('error_occurred');
    }
  }
};

const handleSave = async (payload: {
  id: string;
  updates: Partial<Bivouac>;
}) => {
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
  const success = await adminStore.updateBivouac(payload.id, payload.updates);
  if (success) {
    feedbackMessage.value = t('changes_saved');
    isError.value = false;
    await adminStore.fetchBivouacs();
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
    header: t('name'),
    accessorKey: 'name',
  },
  {
    header: t('region'),
    accessorKey: 'region',
  },
  {
    header: t('mountainRange'),
    accessorKey: 'mountainRange',
  },
  {
    header: t('comune'),
    accessorKey: 'comune',
  },
  {
    header: t('latitude'),
    accessorKey: 'coords.latitude',
  },
  {
    header: t('longitude'),
    accessorKey: 'coords.longitude',
  },
  {
    header: t('altitude'),
    accessorKey: 'altitude',
  },
  {
    header: t('capacity'),
    accessorKey: 'capacity',
  },
  {
    header: t('note'),
    accessorKey: 'note',
  },
  {
    header: t('actions'),
    accessorKey: 'actions',
    enableSorting: false,
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
      :data="bivouacs"
      search-key="name"
      :search-key-label="t('name')"
    >
      <template #header-name="{ column }">
        <Button
          variant="ghost"
          class="pl-0 hover:bg-transparent"
          @click="column.toggleSorting(column.getIsSorted() === 'asc')"
        >
          {{ t('name') }}
          <ArrowUpDown class="ml-2 h-4 w-4" />
        </Button>
      </template>
      <template #cell-name="{ row }">
        <span class="font-medium pl-4">{{ row.name }}</span>
      </template>

      <template #cell-altitude="{ row }"> {{ row.altitude }} m </template>

      <template #cell-actions="{ row }">
        <BivouacActions
          :bivouac="row"
          @edit="onOpenEdit"
          @delete="onDeleteBivouac"
        />
      </template>
    </DataTable>

    <BivouacEditSheet
      v-model:open="isEditOpen"
      :bivouac="selectedBivouac"
      @save="handleSave"
      @update:message="updateAlertMessage"
    />
  </div>
</template>

<i18n>
{
  "en": {
    "edit_bivouac": "Edit Bivouac",
    "auto_save_notice": "Changes are saved automatically when you modify a field.",
    "saving": "Saving...",
    "note": "Notes",
    "capacity": "Capacity",
    "altitude": "Elevation",
    "name": "Name",
    "region": "Region",
    "mountainRange": "Mountain Range",
    "comune": "Comune",
    "latitude": "Latitude",
    "longitude": "Longitude",
    "actions": "Actions",
    "confirm_delete": "Are you sure you want to delete this bivouac?",
    "error_occurred": "An error occurred.",
    "changes_saved": "Changes saved successfully."
  },
  "it": {
    "edit_bivouac": "Modifica Bivacco",
    "auto_save_notice": "Le modifiche vengono salvate automaticamente quando modifichi un campo.",
    "saving": "Salvataggio...",
    "note": "Note",
    "capacity": "Posti Letto",
    "altitude": "Altitudine",
    "name": "Nome",
    "region": "Regione",
    "mountainRange": "Catena Montuosa",
    "comune": "Comune",
    "latitude": "Latitudine",
    "longitude": "Longitudine",
    "actions": "Azioni",
    "confirm_delete": "Sei sicuro di voler eliminare questo bivacco?",
    "error_occurred": "Si è verificato un errore.",
    "changes_saved": "Modifiche salvate con successo."
  },
  "es": {
    "edit_bivouac": "Editar Vivac",
    "auto_save_notice": "Los cambios se guardan automáticamente al modificar un campo.",
    "saving": "Guardando...",
    "note": "Notas",
    "capacity": "Capacidad",
    "altitude": "Altitud",
    "name": "Nombre",
    "region": "Región",
    "mountainRange": "Cordillera",
    "comune": "Municipio",
    "latitude": "Latitud",
    "longitude": "Longitud",
    "actions": "Acciones",
    "confirm_delete": "¿Estás seguro de que deseas eliminar este vivac?",
    "error_occurred": "Ocurrió un error.",
    "changes_saved": "Cambios guardados con éxito."
  }
}
</i18n>
