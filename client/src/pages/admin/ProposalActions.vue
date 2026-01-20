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
import { MoreHorizontal, Trash2, Copy } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  proposal: {
    id: string;
    email?: string;
  };
}>();

const emit = defineEmits<{
  (e: 'delete', id: string): void;
}>();

const { t } = useI18n();

function copyId() {
  navigator.clipboard.writeText(props.proposal.id);
}

function copySenderEmail() {
  navigator.clipboard.writeText(props.proposal.email ?? '');
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

      <DropdownMenuItem v-if="proposal.email" @click="copySenderEmail">
        <Copy class="mr-2 h-4 w-4" />
        {{ t('copy_sender_email') }}
      </DropdownMenuItem>
      <DropdownMenuSeparator v-if="proposal.email" />

      <DropdownMenuItem
        class="text-red-600 focus:text-red-600"
        @click="$emit('delete', proposal.id)"
      >
        <Trash2 class="mr-2 h-4 w-4" />
        {{ t('delete_proposal') }}
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
    "copy_sender_email": "Copy Sender Email",
    "delete_proposal": "Delete Proposal"
  },
  "it": {
    "open_menu": "Apri menu",
    "actions": "Azioni",
    "copy_id": "Copia ID",
    "copy_sender_email": "Copia Email Mittente",
    "delete_proposal": "Elimina Proposta"
  },
  "es": {
    "open_menu": "Abrir menú",
    "actions": "Acciones",
    "copy_id": "Copiar ID",
    "copy_sender_email": "Copiar Correo del Remitente",
    "delete_proposal": "Eliminar Propuesta"
  }
}
</i18n>
