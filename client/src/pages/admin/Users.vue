<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DataTable from '@/components/ui/data-table/DataTable.vue';
import UserActions from './UserActions.vue';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-vue-next';

type User = {
  id: string;
  name: string;
  email: string;
  type: 'admin' | 'user';
  status: 'active' | 'banned';
  creationDate: Date;
};

const { t, locale } = useI18n();

// todo fetch users from API
const data = ref<User[]>([
  {
    id: '1',
    name: 'Mario Rossi',
    email: 'mario@example.com',
    type: 'admin',
    status: 'active',
    creationDate: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Luigi Verdi',
    email: 'luigi@example.com',
    type: 'user',
    status: 'banned',
    creationDate: new Date('2024-02-20'),
  },
]);

const columns = [
  { accessorKey: 'name', header: t('name') },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'type', header: t('type') },
  { accessorKey: 'status', header: t('status') },
  { accessorKey: 'creationDate', header: t('creation_date') },
  { accessorKey: 'actions', header: t('actions') },
];

const onBanUser = (id: string) => {
  const user = data.value.find((u) => u.id === id);
  if (user) user.status = user.status === 'active' ? 'banned' : 'active';
};

const onDeleteUser = (id: string) => {
  if (confirm(t('confirm_delete')))
    data.value = data.value.filter((u) => u.id !== id);
};
</script>

<template>
  <DataTable :columns="columns" :data="data" search-key="email">
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
      <div class="font-medium pl-4">{{ row.name }}</div>
    </template>

    <template #cell-type="{ row }">
      <span
        class="capitalize badge badge-outline px-2 py-1 rounded-full text-xs bg-secondary"
      >
        {{ row.type }}
      </span>
    </template>

    <template #cell-status="{ row }">
      <span
        class="font-bold text-xs"
        :class="row.status === 'active' ? 'text-green-600' : 'text-red-600'"
      >
        {{ row.status === 'active' ? t('active') : t('banned') }}
      </span>
    </template>

    <template #cell-creationDate="{ row }">
      <span class="text-sm">{{
        new Date(row.creationDate).toLocaleDateString(
          ['it', 'es'].includes(locale) ? 'it-IT' : 'en-US',
          {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }
        )
      }}</span>
    </template>

    <template #cell-actions="{ row }">
      <UserActions :user="row" @ban="onBanUser" @delete="onDeleteUser" />
    </template>
  </DataTable>
</template>
<i18n>
{
  "en": {
    "name": "Name",
    "type": "Role",
    "status": "Status",
    "creation_date": "Creation Date",
    "actions": "Actions",
    "active": "Active",
    "banned": "Banned",
    "confirm_delete": "Are you sure you want to delete this user?"
  },
  "it": {
    "name": "Nome",
    "role": "Ruolo",
    "status": "Stato",
    "creation_date": "Data di creazione",
    "actions": "Azioni",
    "active": "Attivo",
    "banned": "Bannato",
    "confirm_delete": "Sei sicuro di voler eliminare questo utente?"
  },
  "es": {
    "name": "Nombre",
    "role": "Rol",
    "status": "Estado",
    "creation_date": "Fecha de creación",
    "actions": "Acciones",
    "active": "Activo",
    "banned": "Prohibido",
    "confirm_delete": "¿Estás seguro de que deseas eliminar este usuario?"
  }
}
</i18n>
