<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

// --- UI Components ---
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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

const { t } = useI18n();

const props = defineProps<{
  modelValue: string[];
}>();

const emit = defineEmits(['update:modelValue']);
const openRegions = ref(false); // Popover state  

// --- Constants ---
const ITALIAN_REGIONS = [
  "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna",
  "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche",
  "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana",
  "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto"
];

// --- Logic: Toggle Region (Add/Remove from Popover) ---
const toggleRegion = (region: string) => {
  const current = [...props.modelValue];
  if (current.includes(region)) {
    emit('update:modelValue', current.filter((r) => r !== region));
  } else {
    current.push(region);
    emit('update:modelValue', current);
  }
};

// --- Logic: Remove Tag (Remove from Badge) ---
const removeRegion = (region: string) => {
  const current = props.modelValue.filter((r) => r !== region);
  emit('update:modelValue', current);
};

</script>

<template>
  <Card class="h-full border-none shadow-md">
    <CardHeader>
      <CardTitle>{{ t("preferred_regions") }}</CardTitle>
      <CardDescription>{{ t("personalize_trekking") }}</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      
      <div class="flex flex-col gap-4">
        <Label class="text-base">{{ t("select_regions") }}</Label>
        
        <Popover v-model:open="openRegions">
          <PopoverTrigger as-child>
            <Button
              type="button" 
              variant="outline"
              role="combobox"
              :aria-expanded="openRegions"
              class="justify-between w-full h-12 px-4 text-left"
            >
              <span class="text-muted-foreground" v-if="modelValue.length === 0">
                {{ t("select_regions") }}
              </span>
              <span class="text-foreground" v-else>
                 {{ modelValue.length }} {{ t("selected_regions") }}
              </span>
              <ChevronsUpDown class="w-4 h-4 ml-2 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>

          <PopoverContent class="w-[--radix-popover-trigger-width] p-0 z-50" align="start">
            <Command>
              <CommandInput :placeholder="t('search_region')" />
              <CommandEmpty>{{ t("no_region_found") }}</CommandEmpty>
              
              <CommandList class="max-h-[300px] overflow-y-auto">
                <CommandGroup>
                  <CommandItem
                    v-for="region in ITALIAN_REGIONS"
                    :key="region"
                    :value="region"
                    @select="() => toggleRegion(region)"
                    class="cursor-pointer"
                  >
                    <Check
                      :class="cn(
                        'mr-2 h-4 w-4 transition-opacity',
                        modelValue.includes(region) ? 'opacity-100' : 'opacity-0'
                      )"
                    />
                    {{ region }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div class="min-h-[100px] p-4 border rounded-lg bg-muted/20">
          <p v-if="modelValue.length === 0" class="text-sm italic text-muted-foreground">
            {{t("no_region_found")}}
          </p>
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
      </div>

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
    "no_region_found": "No region found."
  },
  "it": {
    "preferred_regions": "Regioni Preferite",
    "personalize_trekking": "Personalizza la tua esperienza di trekking.",
    "select_regions": "Seleziona regioni...",
    "selected_regions": "regioni selezionate",
    "search_region": "Cerca regione...",
    "no_region_found": "Nessuna regione trovata."
  },
  "es": {
    "preferred_regions": "Regiones Preferidas",
    "personalize_trekking": "Personaliza tu experiencia de senderismo.",
    "select_regions": "Seleccionar regiones...",
    "selected_regions": "regiones seleccionadas",
    "search_region": "Buscar región...",
    "no_region_found": "No se encontró ninguna región."
  }
}
</i18n>