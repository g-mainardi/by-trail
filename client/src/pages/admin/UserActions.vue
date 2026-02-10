<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Trash2,
  Ban,
  CheckCircle,
  Copy,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { type UserStatus, UserStatusEnum } from '@by-trail/shared';

const { ACTIVE } = UserStatusEnum;

const props = defineProps<{
  user: {
    id: string;
    status: UserStatus;
  };
}>();

const emit = defineEmits<{
  (e: 'ban', id: string): void;
  (e: 'delete', id: string): void;
}>();

const { t } = useI18n();

function copyId() {
  navigator.clipboard.writeText(props.user.id);
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">{{ t('open_menu') }}</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{{ t('actions') }}</DropdownMenuLabel>
      <DropdownMenuItem @click="copyId">
        <Copy class="mr-2 h-4 w-4" />
        {{ t('copy_id') }}
      </DropdownMenuItem>
      <DropdownMenuSeparator />

      <DropdownMenuItem @click="$emit('ban', user.id)">
        <component
          :is="user.status === ACTIVE ? Ban : CheckCircle"
          class="mr-2 h-4 w-4"
        />
        {{ user.status === ACTIVE ? t('ban_user') : t('unban_user') }}
      </DropdownMenuItem>

      <DropdownMenuItem
        class="text-red-600 focus:text-red-600"
        @click="$emit('delete', user.id)"
      >
        <Trash2 class="mr-2 h-4 w-4" />
        {{ t('delete_user') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<i18n>
{
  "en": {
    "open_menu": "Open menu",
    "actions": "Actions",
    "copy_id": "Copy ID",
    "ban_user": "Ban User",
    "unban_user": "Unban User",
    "delete_user": "Delete User"
  },
  "it": {
    "open_menu": "Apri menu",
    "actions": "Azioni",
    "copy_id": "Copia ID",
    "ban_user": "Banna Utente",
    "unban_user": "Sblocca Utente",
    "delete_user": "Elimina Utente"
  },
  "es": {
    "open_menu": "Abrir menú",
    "actions": "Acciones",
    "copy_id": "Copiar ID",
    "ban_user": "Banear Usuario",
    "unban_user": "Desbanear Usuario",
    "delete_user": "Eliminar Usuario"
  }
}
</i18n>
