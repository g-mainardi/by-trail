<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { type Bivouac, type Region, RegionsEnum } from '@/types';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const props = defineProps<{
  open: boolean;
  bivouac: Bivouac | null;
  isLoading?: boolean;
}>();

const emit = defineEmits(['update:open', 'save']);
const updates = ref<Partial<Bivouac>>({});

const { t } = useI18n();

const wrapCoordChange = (key: 'latitude' | 'longitude', value: number) => {
  return {
    ...(props.bivouac?.coords || { latitude: 0, longitude: 0 }),
    [key]: value,
  };
};

const handleChange = <K extends keyof Bivouac>(field: K, value: Bivouac[K]) => {
  updates.value = {
    ...updates.value,
    [field]: value,
  };
};

const handleSave = async () => {
  if (Object.keys(updates.value).length > 0) {
    emit('save', {
      id: props.bivouac?.id || props.bivouac?._id || '',
      updates: updates.value,
    });
  }
  emit('update:open', false);
};
</script>

<template>
  <Sheet :open="open" @update:open="$emit('update:open', $event)">
    <SheetContent class="overflow-y-auto sm:max-w-md">
      <SheetHeader>
        <SheetTitle>{{ t('edit_bivouac') }}</SheetTitle>
        <SheetDescription>
          {{ t('edit_bivouac_description') }}
        </SheetDescription>
      </SheetHeader>

      <div class="flex flex-col px-4 gap-4">
        <div v-if="bivouac" class="flex flex-col gap-4">
          <div class="grid w-full items-center gap-1.5">
            <div class="flex justify-between">
              <Label for="name">{{ t('name') }}</Label>
            </div>
            <Input
              id="name"
              :model-value="bivouac.name"
              @change="handleChange('name', $event.target.value)"
            />
          </div>

          <div class="grid w-full items-center gap-1.5">
            <Label>{{ t('region') }}</Label>
            <Select
              :model-value="updates.region ?? bivouac.region"
              @update:model-value="
                (val) => handleChange('region', val as Region)
              "
            >
              <SelectTrigger>
                <SelectValue :placeholder="t('select_region')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="region in Object.values(RegionsEnum)"
                  :key="region"
                  :value="region"
                >
                  {{ region }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid w-full items-center gap-1.5">
            <Label for="mountainRange">{{ t('mountainRange') }}</Label>
            <Input
              id="mountainRange"
              :model-value="bivouac.mountainRange"
              @change="handleChange('mountainRange', $event.target.value)"
            />
          </div>

          <div class="grid w-full items-center gap-1.5">
            <Label for="comune">{{ t('comune') }}</Label>
            <Input
              id="comune"
              :model-value="bivouac.comune"
              @change="handleChange('comune', $event.target.value)"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="grid w-full items-center gap-1.5">
              <Label for="lat">{{ t('latitude') }}</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                :model-value="bivouac.coords?.latitude"
                @change="
                  handleChange(
                    'coords',
                    wrapCoordChange('latitude', $event.target.value)
                  )
                "
              />
            </div>
            <div class="grid w-full items-center gap-1.5">
              <Label for="lng">{{ t('longitude') }}</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                :model-value="bivouac.coords?.longitude"
                @change="
                  handleChange(
                    'coords',
                    wrapCoordChange('longitude', $event.target.value)
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
                @change="handleChange('altitude', $event.target.value)"
              />
            </div>
            <div class="grid w-full items-center gap-1.5">
              <Label for="capacity">{{ t('capacity') }}</Label>
              <Input
                id="capacity"
                type="number"
                min="0"
                :model-value="bivouac.capacity"
                @change="handleChange('capacity', $event.target.value)"
              />
            </div>
          </div>

          <div class="grid w-full items-center gap-1.5">
            <div class="flex justify-between">
              <Label for="note">{{ t('note') }}</Label>
            </div>
            <Textarea
              id="note"
              :model-value="bivouac.note"
              @change="handleChange('note', $event.target.value)"
              class="min-h-[100px]"
            />
          </div>
        </div>

        <Button
          @click="handleSave()"
          :disabled="isLoading"
          size="lg"
          class="w-full sm:w-auto"
        >
          <Save class="w-4 h-4 mr-2" />
          <span v-if="isLoading">{{ t('saving') }}</span>
          <span v-else>{{ t('save_modifications') }}</span>
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
<i18n>
{
  "en": {
    "edit_bivouac": "Edit Bivouac",
    "edit_bivouac_description": "Remember to save the modifications with the button at the end of the sheet.",
    "name": "Name",
    "region": "Region",
    "altitude": "Altitude",
    "capacity": "Capacity",
    "note": "Note",
    "saving": "Saving...",
    "mountainRange": "Mountain Range",
    "comune": "Comune",
    "latitude": "Latitude",
    "longitude": "Longitude",
    "select_region": "Select Region",
    "save_modifications": "Save Changes"
  },
  "it": {
    "edit_bivouac": "Modifica Bivacco",
    "edit_bivouac_description": "Ricorda di salvare le modifiche con il pulsante in fondo alla scheda.",
    "name": "Nome",
    "region": "Regione",
    "altitude": "Altitudine",
    "capacity": "Capacità",
    "note": "Nota",
    "saving": "Salvataggio...",
    "mountainRange": "Catena Montuosa",
    "comune": "Comune",
    "latitude": "Latitudine",
    "longitude": "Longitudine",
    "select_region": "Seleziona Regione",
    "save_modifications": "Salva Modifiche"
  },
  "es": {
    "edit_bivouac": "Editar Vivac",
    "edit_bivouac_description": "Recuerda guardar las modificaciones con el botón al final de la hoja.",
    "name": "Nombre",
    "region": "Región",
    "altitude": "Altitud",
    "capacity": "Capacidad",
    "note": "Nota",
    "saving": "Guardando...",
    "mountainRange": "Cordillera",
    "comune": "Municipio",
    "latitude": "Latitud",
    "longitude": "Longitud",
    "select_region": "Seleccionar Región",
    "save_modifications": "Guardar Cambios"
  }
}
</i18n>
