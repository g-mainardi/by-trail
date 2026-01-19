<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  type Region,
  type Route,
  type RouteDifficulty,
  type RouteType,
  RegionsEnum,
  RouteDifficultyEnum,
  RouteTypeEnum,
} from '@/types';

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
import { isEqual } from './utils';

const props = defineProps<{
  open: boolean;
  route: Route | null;
  isLoading?: boolean;
}>();

const emit = defineEmits(['update:open', 'save']);
const updates = ref<Partial<Route>>({});

const { t } = useI18n();

const handleChange = <K extends keyof Route>(field: K, value: Route[K]) => {
  const originalValue = props.route ? props.route[field] : undefined;

  if (isEqual(originalValue, value)) {
    // Value matches original (either primitive or object content), remove pending update
    const newUpdates = { ...updates.value };
    delete newUpdates[field];
    updates.value = newUpdates;
  } else {
    // Value is actually different, save it
    updates.value = {
      ...updates.value,
      [field]: value,
    };
  }
};

const handleSave = async () => {
  if (Object.keys(updates.value).length > 0) {
    emit('save', {
      id: props.route?.id || props.route?._id || '',
      updates: updates.value,
    });
  }
  onClose();
};

const onClose = () => {
  updates.value = {};
  emit('update:open', false);
};
</script>

<template>
  <Sheet
    :open="open"
    @update:open="
      (val) => {
        if (!val) onClose();
        else emit('update:open', true);
      }
    "
  >
    <SheetContent class="overflow-y-auto sm:max-w-md">
      <SheetHeader>
        <SheetTitle>{{ t('edit_route') }}</SheetTitle>
        <SheetDescription>
          {{ t('edit_route_description') }}
        </SheetDescription>
      </SheetHeader>

      <div class="flex flex-col px-4 gap-4">
        <div v-if="route" class="flex flex-col gap-4">
          <div class="grid w-full items-center gap-1.5">
            <div class="flex justify-between">
              <Label for="title">{{ t('title') }}</Label>
            </div>
            <Input
              id="title"
              :model-value="route.title"
              @change="handleChange('title', $event.target.value)"
            />
          </div>

          <div class="grid w-full items-center gap-1.5">
            <Label>{{ t('region') }}</Label>
            <Select
              :model-value="updates.region ?? route.region"
              @update:model-value="
                (val) => handleChange('region', (val as Region[]).sort())
              "
              multiple
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

          <div class="grid grid-cols-2 gap-4">
            <div class="grid w-full items-center gap-1.5">
              <Label>{{ t('route_type') }}</Label>
              <Select
                :model-value="updates.routeType ?? route.routeType"
                @update:modelValue="
                  (val) => handleChange('routeType', val as RouteType)
                "
              >
                <SelectTrigger>
                  <SelectValue :placeholder="t('select_route_type')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="routeType in Object.values(RouteTypeEnum)"
                    :key="routeType"
                    :value="routeType"
                  >
                    {{ routeType }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid w-full items-center gap-1.5">
              <Label>{{ t('difficulty') }}</Label>
              <Select
                :model-value="updates.difficulty ?? route.difficulty"
                @update:modelValue="
                  (val) => handleChange('difficulty', val as RouteDifficulty)
                "
              >
                <SelectTrigger>
                  <SelectValue :placeholder="t('select_difficulty')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="difficulty in Object.values(RouteDifficultyEnum)"
                    :key="difficulty"
                    :value="difficulty"
                  >
                    {{ difficulty }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="grid w-full items-center gap-1.5">
              <Label for="distance">{{ t('distance') }}</Label>
              <Input
                id="distance"
                type="number"
                min="0"
                :model-value="route.distance"
                @change="handleChange('distance', Number($event.target.value))"
              />
            </div>
            <div class="grid w-full items-center gap-1.5">
              <Label for="duration">{{ t('duration') }}</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                :model-value="route.duration"
                @change="handleChange('duration', Number($event.target.value))"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="grid w-full items-center gap-1.5">
              <Label for="ascent">{{ t('ascent') }}</Label>
              <Input
                id="ascent"
                type="number"
                min="0"
                :model-value="route.ascent"
                @change="handleChange('ascent', Number($event.target.value))"
              />
            </div>
            <div class="grid w-full items-center gap-1.5">
              <Label for="descent">{{ t('descent') }}</Label>
              <Input
                id="descent"
                type="number"
                min="0"
                :model-value="route.descent"
                @change="handleChange('descent', Number($event.target.value))"
              />
            </div>
          </div>

          <div class="grid w-full items-center gap-1.5">
            <div class="flex justify-between">
              <Label for="note">{{ t('note') }}</Label>
            </div>
            <Textarea
              id="note"
              :model-value="route.note"
              @change="handleChange('note', $event.target.value)"
              class="min-h-[100px]"
            />
          </div>
        </div>

        <Button
          @click="handleSave()"
          :disabled="isLoading || Object.keys(updates).length === 0"
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
    "edit_route": "Edit Route",
    "edit_route_description": "Modify the details of the selected route.",
    "title": "Title",
    "region": "Region",
    "select_region": "Select a region",
    "route_type": "Route Type",
    "select_route_type": "Select route type",
    "difficulty": "Difficulty",
    "select_difficulty": "Select difficulty",
    "distance": "Distance (m)",
    "duration": "Duration (min)",
    "ascent": "Ascent (m)",
    "descent": "Descent (m)",
    "note": "Note",
    "save_modifications": "Save Modifications",
    "saving": "Saving..."
  },
  "it": {
    "edit_route": "Modifica Percorso",
    "edit_route_description": "Modifica i dettagli del percorso selezionato.",
    "title": "Titolo",
    "region": "Regione",
    "select_region": "Seleziona una regione",
    "route_type": "Tipo di Percorso",
    "select_route_type": "Seleziona tipo di percorso",
    "difficulty": "Difficoltà",
    "select_difficulty": "Seleziona difficoltà",
    "distance": "Distanza (m)",
    "duration": "Durata (min)",
    "ascent": "Dislivello in salita (m)",
    "descent": "Dislivello in discesa (m)",
    "note": "Nota",
    "save_modifications": "Salva Modifiche",
    "saving": "Salvataggio..."
  },
  "es": {
    "edit_route": "Editar Ruta",
    "edit_route_description": "Modifica los detalles de la ruta seleccionada.",
    "title": "Título",
    "region": "Región",
    "select_region": "Selecciona una región",
    "route_type": "Tipo de Ruta",
    "select_route_type": "Selecciona tipo de ruta",
    "difficulty": "Dificultad",
    "select_difficulty": "Selecciona dificultad",
    "distance": "Distancia (m)",
    "duration": "Duración (min)",
    "ascent": "Ascenso (m)",
    "descent": "Descenso (m)",
    "note": "Nota",
    "save_modifications": "Guardar Modificaciones",
    "saving": "Guardando..."
  }
}
</i18n>
