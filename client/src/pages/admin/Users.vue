<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAdminStore } from '@/stores/admin';
import { storeToRefs } from 'pinia';
import {
  type User,
  type UserStatus,
  UserStatusEnum,
  UserTypeEnum,
} from '@by-trail/shared';

import DataTable from '@/components/ui/data-table/DataTable.vue';
import UserActions from './UserActions.vue';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-vue-next';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import { AlertCircle, CheckCircle } from 'lucide-vue-next';
import { Alert, AlertTitle } from '@/components/ui/alert';

const { ACTIVE } = UserStatusEnum;
const { ADMIN } = UserTypeEnum;
const { t, locale } = useI18n();
const adminStore = useAdminStore();
const { users, isLoading } = storeToRefs(adminStore);
const { fetchUsers, toggleUserBlock, deleteUser } = adminStore;
const feedbackMessage = ref('');
const isError = ref(false);

onMounted(() => {
  fetchUsers();
});

const columns = [
  { accessorKey: 'name', header: t('name') },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'type', header: t('type') },
  { accessorKey: 'status', header: t('status') },
  { accessorKey: 'creationDate', header: t('creation_date') },
  { accessorKey: 'actions', header: t('actions') },
];

const onBanUser = async (user: User) => {
  const id = user._id;
  if (!id) return;
  const originalStatus = user.status as UserStatus;
  try {
    // Confirm action
    const confirmed = confirm(
      originalStatus === ACTIVE
        ? t('confirm_ban_user')
        : t('confirm_unban_user')
    );
    if (!confirmed) return;
    // Store will handle the toggling logic
    const success = await toggleUserBlock(id, originalStatus);
    if (!success) throw new Error('Status toggle failed');
  } catch (e) {
    feedbackMessage.value = t('user_ban_error');
    isError.value = true;
    return;
  }
  feedbackMessage.value = t(
    originalStatus === ACTIVE ? 'user_ban_success' : 'user_unban_success'
  );
  isError.value = false;
};

const onDeleteUser = async (user: User) => {
  const id = user._id;
  if (!id) return;
  try {
    if (!id) return;
    const confirmed = confirm(t('confirm_delete'));
    if (!confirmed) return;
    const success = await deleteUser(id);
    if (!success) throw new Error('Deletion failed');
  } catch (e) {
    feedbackMessage.value = t('user_delete_error');
    isError.value = true;
    return;
  }
  feedbackMessage.value = t('user_delete_success');
  isError.value = false;
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

    <DataTable :columns="columns" :data="users" search-key="email">
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
          :class="row.type"
        >
          {{ row.type }}
        </span>
      </template>

      <template #cell-status="{ row }">
        <span class="font-bold text-xs" :class="row.status">
          {{ t(row.status || '') }}
        </span>
      </template>

      <template #cell-creationDate="{ row }">
        <span class="text-xs text-muted-foreground">{{
          row.creationDate
            ? new Date(row.creationDate).toLocaleDateString(
                ['it', 'es'].includes(locale) ? 'it-IT' : 'en-US',
                {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }
              )
            : '-'
        }}</span>
      </template>

      <template #cell-actions="{ row }">
        <UserActions
          v-if="row.type !== ADMIN"
          :user="{ ...row, id: row._id || '', status: row.status || ACTIVE }"
          @ban="onBanUser(row)"
          @delete="onDeleteUser(row)"
        />
      </template>
    </DataTable>
  </div>
</template>
<style scoped>
.admin {
  background-color: #e6f0fa; /* light blue */
  color: #555; /* gray */
  font-weight: bold;
}
.user {
  color: #888; /* gray */
  background-color: transparent;
  font-weight: normal;
}
.active {
  color: #16a34a; /* green */
}
.banned {
  color: #dc2626; /* red */
}
</style>
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
    "confirm_delete": "Are you sure you want to delete this user?",
    "confirm_ban_user": "Are you sure you want to ban this user?",
    "confirm_unban_user": "Are you sure you want to unban this user?",
    "user_ban_success": "User banned successfully.",
    "user_unban_success": "User unbanned successfully.",
    "user_ban_error": "Error updating user status.",
    "user_delete_success": "User deleted successfully.",
    "user_delete_error": "Error deleting user."
  },
  "it": {
    "name": "Nome",
    "type": "Ruolo",
    "status": "Stato",
    "creation_date": "Data di creazione",
    "actions": "Azioni",
    "active": "Attivo",
    "banned": "Bannato",
    "confirm_delete": "Sei sicuro di voler eliminare questo utente?",
    "confirm_ban_user": "Sei sicuro di voler bannare questo utente?",
    "confirm_unban_user": "Sei sicuro di voler sbannare questo utente?",
    "user_ban_success": "Utente bannato con successo.",
    "user_unban_success": "Utente sbannato con successo.",
    "user_ban_error": "Errore durante l'aggiornamento dello stato utente.",
    "user_delete_success": "Utente eliminato con successo.",
    "user_delete_error": "Errore durante l'eliminazione dell'utente."
  },
  "es": {
    "name": "Nombre",
    "type": "Rol",
    "status": "Estado",
    "creation_date": "Fecha de creación",
    "actions": "Acciones",
    "active": "Activo",
    "banned": "Prohibido",
    "confirm_delete": "¿Estás seguro de que deseas eliminar este usuario?",
    "confirm_ban_user": "¿Estás seguro de que deseas prohibir a este usuario?",
    "confirm_unban_user": "¿Estás seguro de que deseas desprohibir a este usuario?",
    "user_ban_success": "Usuario prohibido con éxito.",
    "user_unban_success": "Usuario desprohibido con éxito.",
    "user_ban_error": "Error al actualizar el estado del usuario.",
    "user_delete_success": "Usuario eliminado con éxito.",
    "user_delete_error": "Error al eliminar el usuario."
  }
}
</i18n>
