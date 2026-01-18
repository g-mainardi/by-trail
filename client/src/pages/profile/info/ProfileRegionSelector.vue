<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Region } from '@/types/index';
import { RegionsEnum } from '@/types/index';

// --- UI Components ---
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, X } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import P from '@/layouts/typography/P.vue';

const { t } = useI18n();

const props = defineProps<{
  modelValue: Region[];
}>();

const emit = defineEmits(['update:modelValue']);
const openRegions = ref(false); // Popover state

// --- Logic: Toggle Region (Add/Remove from Popover) ---
const toggleRegion = (region: Region) => {
  const current = [...props.modelValue];
  if (current.includes(region)) {
    emit(
      'update:modelValue',
      current.filter((r) => r !== region)
    );
  } else {
    current.push(region);
    emit('update:modelValue', current);
  }
};

// --- Logic: Remove Tag (Remove from Badge) ---
const removeRegion = (region: Region) => {
  const current = props.modelValue.filter((r) => r !== region);
  emit('update:modelValue', current);
};
</script>

<template>
  <Card class="h-full border-none shadow-md">
    <CardHeader>
      <CardTitle>{{ t('preferred_regions') }}</CardTitle>
      <CardDescription>{{ t('personalize_trekking') }}</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <FieldGroup>
        <FieldLabel class="text-base">{{ t('select_regions') }}</FieldLabel>

        <Popover v-model:open="openRegions">
          <PopoverTrigger as-child>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              :aria-expanded="openRegions"
              class="justify-between w-full h-12 px-4 text-left"
            >
              <span
                v-if="modelValue.length === 0"
                class="text-muted-foreground"
              >
                {{ t('select_regions') }}
              </span>
              <span v-else class="text-foreground">
                {{ modelValue.length }} {{ t('selected_regions') }}
              </span>
              <ChevronsUpDown class="w-4 h-4 ml-2 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            class="w-[--radix-popover-trigger-width] p-0 z-50"
            align="start"
          >
            <Command>
              <CommandInput :placeholder="t('search_region')" />
              <CommandEmpty>{{ t('no_region_found') }}</CommandEmpty>

              <CommandList class="max-h-[300px] overflow-y-auto">
                <CommandGroup>
                  <CommandItem
                    v-for="region in RegionsEnum"
                    :key="region"
                    :value="region"
                    @select="() => toggleRegion(region)"
                    class="cursor-pointer"
                  >
                    <Check
                      :class="
                        cn(
                          'mr-2 h-4 w-4 transition-opacity',
                          modelValue.includes(region)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )
                      "
                    />
                    {{ region }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div class="min-h-[100px] p-4 border rounded-lg bg-muted/20">
          <P
            v-if="modelValue.length === 0"
            class="italic text-muted-foreground"
          >
            {{ t('no_region_selected') }}
          </P>
          <div v-else class="flex flex-wrap gap-2">
            <Badge
              v-for="region in modelValue"
              :key="region"
              variant="secondary"
              class="flex items-center gap-1 px-3 py-1.5 text-sm transition-all hover:text-red-500"
            >
              {{ region }}
              <button
                type="button"
                class="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                @click.prevent.stop="removeRegion(region)"
              >
                <X class="w-3 h-3 cursor-pointer" />
              </button>
            </Badge>
          </div>
        </div>
      </FieldGroup>
    </CardContent>
  </Card>
</template>

<i18n>
{
  "en": {
    "preferred_regions": "Preferred Regions",
    "personalize_trekking": "Personalize your trekking experience.",
    "select_regions": "Select regions...",
    "selected_regions": "regions selected",
    "search_region": "Search region...",
    "no_region_found": "No region found.",
    "no_region_selected": "No region selected."
  },
  "it": {
    "preferred_regions": "Regioni Preferite",
    "personalize_trekking": "Personalizza la tua esperienza di trekking.",
    "select_regions": "Seleziona regioni...",
    "selected_regions": "regioni selezionate",
    "search_region": "Cerca regione...",
    "no_region_found": "Nessuna regione trovata.",
    "no_region_selected": "Nessuna regione selezionata."
  },
  "es": {
    "preferred_regions": "Regiones Preferidas",
    "personalize_trekking": "Personaliza tu experiencia de senderismo.",
    "select_regions": "Seleccionar regiones...",
    "selected_regions": "regiones seleccionadas",
    "search_region": "Buscar región...",
    "no_region_found": "No se encontró ninguna región.",
    "no_region_selected": "Ninguna región seleccionada."
  }
}
</i18n>
