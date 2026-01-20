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
  };
}>();

const emit = defineEmits<{
  (e: 'delete', id: string): void;
}>();

const { t } = useI18n();

function copyId() {
  navigator.clipboard.writeText(props.proposal.id);
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
    "delete_proposal": "Delete Proposal"
  },
  "it": {
    "open_menu": "Apri menu",
    "actions": "Azioni",
    "copy_id": "Copia ID",
    "delete_proposal": "Elimina Proposta"
  },
  "es": {
    "open_menu": "Abrir menú",
    "actions": "Acciones",
    "copy_id": "Copiar ID",
    "delete_proposal": "Eliminar Propuesta"
  }
}
</i18n>
