<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAdminStore } from '@/stores/admin';
import type { Bivouac } from '@/types';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Loader2 } from 'lucide-vue-next';

const props = defineProps<{
  open: boolean;
  bivouac: Bivouac | null;
}>();

const emit = defineEmits(['update:open']);

const { t } = useI18n();
const store = useAdminStore();

// Local state to track which field is being saved
const savingField = ref<string | null>(null);

const onAutoSave = async (
  key: keyof Bivouac | 'latitude' | 'longitude',
  value: any
) => {
  if (!props.bivouac) return;
  const id = props.bivouac.id || props.bivouac._id || '';

  savingField.value = key;

  let payload: Partial<Bivouac> = {};

  // Handle coordinates separately
  if (key === 'latitude' || key === 'longitude') {
    payload = {
      coords: {
        latitude: props.bivouac.coords?.latitude ?? 0,
        longitude: props.bivouac.coords?.longitude ?? 0,
        [key]: Number(value),
      },
    };
  } else {
    // Other fields
    payload = { [key]: value };
  }

  await store.updateBivouac(id, payload);

  // Reset savingField after a short delay
  setTimeout(() => {
    savingField.value = null;
  }, 1000);
};
</script>

<template>
  <Sheet :open="open" @update:open="$emit('update:open', $event)">
    <SheetContent class="overflow-y-auto sm:max-w-md">
      <SheetHeader>
        <SheetTitle>{{ t('edit_bivouac') }}</SheetTitle>
        <SheetDescription>
          {{ t('auto_save_notice') }}
        </SheetDescription>
      </SheetHeader>

      <div v-if="bivouac" class="grid gap-4 py-4">
        <div class="grid w-full items-center gap-1.5">
          <div class="flex justify-between">
            <Label for="name">{{ t('name') }}</Label>
            <span
              v-if="savingField === 'name'"
              class="text-xs text-muted-foreground flex items-center"
            >
              <Loader2 class="h-3 w-3 animate-spin mr-1" /> {{ t('saving') }}
            </span>
          </div>
          <Input
            id="name"
            :model-value="bivouac.name"
            @change="
              onAutoSave('name', ($event.target as HTMLInputElement).value)
            "
          />
        </div>

        <div class="grid w-full items-center gap-1.5">
          <Label for="region">{{ t('region') }}</Label>
          <Input
            id="region"
            :model-value="bivouac.region"
            @change="
              onAutoSave('region', ($event.target as HTMLInputElement).value)
            "
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="grid w-full items-center gap-1.5">
            <Label for="lat">Lat</Label>
            <Input
              id="lat"
              type="number"
              step="any"
              :model-value="bivouac.coords?.latitude"
              @change="
                onAutoSave(
                  'latitude',
                  ($event.target as HTMLInputElement).value
                )
              "
            />
          </div>
          <div class="grid w-full items-center gap-1.5">
            <Label for="lng">Lng</Label>
            <Input
              id="lng"
              type="number"
              step="any"
              :model-value="bivouac.coords?.longitude"
              @change="
                onAutoSave(
                  'longitude',
                  ($event.target as HTMLInputElement).value
                )
              "
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="grid w-full items-center gap-1.5">
            <Label for="altitude">{{ t('altitude') }}</Label>
            <Input
              id="altitude"
              type="number"
              :model-value="bivouac.altitude"
              @change="
                onAutoSave(
                  'altitude',
                  Number(($event.target as HTMLInputElement).value)
                )
              "
            />
          </div>
          <div class="grid w-full items-center gap-1.5">
            <Label for="capacity">{{ t('capacity') }}</Label>
            <Input
              id="capacity"
              type="number"
              :model-value="bivouac.capacity"
              @change="
                onAutoSave(
                  'capacity',
                  Number(($event.target as HTMLInputElement).value)
                )
              "
            />
          </div>
        </div>

        <div class="grid w-full items-center gap-1.5">
          <div class="flex justify-between">
            <Label for="note">{{ t('note') }}</Label>
            <span
              v-if="savingField === 'note'"
              class="text-xs text-muted-foreground flex items-center"
            >
              <Loader2 class="h-3 w-3 animate-spin mr-1" /> {{ t('saving') }}
            </span>
          </div>
          <Textarea
            id="note"
            :model-value="bivouac.note"
            class="min-h-[100px]"
            @change="
              onAutoSave('note', ($event.target as HTMLTextAreaElement).value)
            "
          />
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
<i18n>
{
  "en": {
    "edit_bivouac": "Edit Bivouac",
    "auto_save_notice": "Changes are saved automatically.",
    "name": "Name",
    "region": "Region",
    "altitude": "Altitude",
    "capacity": "Capacity",
    "note": "Note",
    "saving": "Saving..."
  },
  "it": {
    "edit_bivouac": "Modifica Bivacco",
    "auto_save_notice": "Le modifiche vengono salvate automaticamente.",
    "name": "Nome",
    "region": "Regione",
    "altitude": "Altitudine",
    "capacity": "Capacità",
    "note": "Nota",
    "saving": "Salvataggio..."
  },
  "es": {
    "edit_bivouac": "Editar Vivac",
    "auto_save_notice": "Los cambios se guardan automáticamente.",
    "name": "Nombre",
    "region": "Región",
    "altitude": "Altitud",
    "capacity": "Capacidad",
    "note": "Nota",
    "saving": "Guardando..."
  }
}
</i18n>
