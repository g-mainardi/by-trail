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
import { MoreHorizontal, Trash2, Pencil, Copy } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import type { Bivouac } from '@by-trail/shared';

const props = defineProps<{
  bivouac: Bivouac;
}>();

const emit = defineEmits<{
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
}>();

const { t } = useI18n();

function copyId() {
  // Handle both id and _id depending on what backend sends
  const id = props.bivouac._id || props.bivouac._id || '';
  navigator.clipboard.writeText(id);
}

function getBivouacId() {
  return props.bivouac._id || props.bivouac._id || '';
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

      <DropdownMenuItem @click="$emit('edit', getBivouacId())">
        <Pencil class="mr-2 h-4 w-4" />
        {{ t('edit_bivouac') }}
      </DropdownMenuItem>

      <DropdownMenuItem
        class="text-red-600 focus:text-red-600"
        @click="$emit('delete', getBivouacId())"
      >
        <Trash2 class="mr-2 h-4 w-4" />
        {{ t('delete_bivouac') }}
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
    "edit_bivouac": "Edit Details",
    "delete_bivouac": "Delete Bivouac"
  },
  "it": {
    "open_menu": "Apri menu",
    "actions": "Azioni",
    "copy_id": "Copia ID",
    "edit_bivouac": "Modifica Dettagli",
    "delete_bivouac": "Elimina Bivacco"
  },
  "es": {
    "open_menu": "Abrir menú",
    "actions": "Acciones",
    "copy_id": "Copiar ID",
    "edit_bivouac": "Editar Detalles",
    "delete_bivouac": "Eliminar Vivac"
  }
}
</i18n>
