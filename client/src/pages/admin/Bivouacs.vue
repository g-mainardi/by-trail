<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAdminStore } from '@/stores/admin';
import { storeToRefs } from 'pinia';
import type { Bivouac } from '@/types';

import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-vue-next';

import DataTable from '@/components/ui/data-table/DataTable.vue';
import BivouacActions from './BivouacsActions.vue';
import BivouacEditSheet from './BivouacsEditSheet.vue';

const { t } = useI18n();
const adminStore = useAdminStore();
const { bivouacs } = storeToRefs(adminStore);

// State for Edit Sheet
const isEditOpen = ref(false);
const selectedBivouac = ref<Bivouac | null>(null);

onMounted(() => {
  adminStore.fetchBivouacs();
});

const getBivouacId = (b: Bivouac) => b.id || b._id || '';

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
    await adminStore.deleteBivouac(id);
    await adminStore.fetchBivouacs();
  }
};

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
    <DataTable :columns="columns" :data="bivouacs" search-key="name">
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

    <BivouacEditSheet v-model:open="isEditOpen" :bivouac="selectedBivouac" />
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
    "confirm_delete": "Are you sure you want to delete this bivouac?"
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
    "confirm_delete": "Sei sicuro di voler eliminare questo bivacco?"
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
    "confirm_delete": "¿Estás seguro de que deseas eliminar este vivac?"
  }
}
</i18n>
