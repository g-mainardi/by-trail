<script setup lang="ts">
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input/Input.vue';
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field';
import Separator from '@/components/ui/separator/Separator.vue';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Toggle from '@/components/ui/toggle/Toggle.vue';
import {
  Bed as BedIcon,
  Heart as HeartIcon,
  Mountain as MountainIcon,
  Search as SearchIcon,
  Settings2Icon,
  Toilet as ToiletIcon,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import type { Filter } from './Bivouacs.vue';
const { t } = useI18n();

defineProps<{
  filters: {
    minDesiredBeds: Filter;
    altitudeFilter: Filter;
    searchQuery: Filter;
  };
}>();
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <Button
        aria-label="Filter options"
        class="fixed top-4 right-4 z-50 text-lg rounded-full shadow-lg py-6 px-12 group"
      >
        <SearchIcon class="w-6 h-6" />/<Settings2Icon class="w-6 h-6" />
      </Button>
    </SheetTrigger>

    <SheetContent>
      <SheetHeader>
        <SheetTitle>{{ t('filters') }}</SheetTitle>
        <SheetDescription>
          {{ t('bar_description') }}
        </SheetDescription>
      </SheetHeader>

      <!-- Filter options -->
      <div class="flex flex-col px-4 gap-4">
        <!-- Search bar Start -->
        <div class="flex items-center gap-2">
          <SearchIcon />
          <Input
            :placeholder="t('search')"
            v-model="filters.searchQuery.currentValue"
          />
        </div>

        <!-- Beds filter Start -->
        <div class="flex items-center gap-2">
          <BedIcon
            :fill="filters.minDesiredBeds.currentValue >= 1 ? 'green' : 'none'"
            :color="
              filters.minDesiredBeds.currentValue >= 1
                ? 'green'
                : 'currentColor'
            "
          />
          <NumberField
            id="beds"
            :default-value="0"
            :min="0"
            v-model="filters.minDesiredBeds.currentValue"
            class="w-full"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>

        <div class="flex items-center gap-2">
          <MountainIcon
            :fill="
              filters.altitudeFilter.currentValue.min >
                filters.altitudeFilter.default.min ||
              filters.altitudeFilter.currentValue.max <
                filters.altitudeFilter.default.max
                ? 'purple'
                : 'none'
            "
          />
          Min
          <NumberField
            id="altitude-min"
            :default-value="filters.altitudeFilter.default.min"
            :min="filters.altitudeFilter.default.min"
            :max="filters.altitudeFilter.default.max"
            v-model="filters.altitudeFilter.currentValue.min"
          >
            <NumberFieldContent>
              <NumberFieldInput />
            </NumberFieldContent>
          </NumberField>
          Max
          <NumberField
            id="altitude-max"
            :default-value="filters.altitudeFilter.default.max"
            :min="filters.altitudeFilter.default.min"
            :max="filters.altitudeFilter.default.max"
            v-model="filters.altitudeFilter.currentValue.max"
          >
            <NumberFieldContent>
              <NumberFieldInput />
            </NumberFieldContent>
          </NumberField>
        </div>

        <Toggle variant="outline" aria-label="With toilets only" class="w-full">
          <ToiletIcon />
          {{ t('with_toilets_only') }}
        </Toggle>

        <Toggle variant="outline" aria-label="Favorites only" class="w-full">
          <HeartIcon />
          {{ t('favorites_only') }}
        </Toggle>

        <Separator orientation="horizontal" />

        <!-- <Toggle variant="outline" aria-label="Only open" v-model="filters.onlyOpen" class="w-full">
          <CalendarIcon :fill="filters.onlyOpen ? 'orange' : 'none'" :color="filters.onlyOpen ? 'orange' : 'currentColor'" />
          {{ t('only_open') }}
        </Toggle> -->

        <Button variant="destructive" @click="$emit('reset')" class="w-full">{{
          t('reset')
        }}</Button>
      </div>
    </SheetContent>
  </Sheet>
</template>

<i18n>
  {
    en: {
      "search": "Search",
      "filters": "Filters",
      "bar_description": "Use the filters below to narrow down your search for bivouacs.",
      "with_toilets_only": "With Toilets Only",
      "favorites_only": "Favorites Only",
      "only_open": "Only Open",
      "set_minimum_beds": "Set minimum beds:",
      "set_altitude_range": "Set Altitude Range (mt):",
      "reset": "Reset"
    },
    it: {
      "search": "Cerca",
      "filters": "Filtri",
      "bar_description": "Usa i filtri qui sotto per restringere la ricerca dei bivacchi.",
      "with_toilets_only": "Solo con servizi igienici",
      "favorites_only": "Solo Preferiti",
      "only_open": "Solo Aperto",
      "set_minimum_beds": "Imposta letti minimi:",
      "set_altitude_range": "Imposta intervallo di altitudine (mt):",
      "reset": "Reimposta"
    },
    es: {
      "search": "Buscar",
      "filters": "Filtros y Búsqueda",
      "bar_description": "Utiliza los filtros a continuación para reducir tu búsqueda de bivouacs.",
      "with_toilets_only": "Solo con baños",
      "favorites_only": "Solo Favoritos",
      "only_open": "Solo Abierto",
      "set_minimum_beds": "Establecer camas mínimas:",
      "set_altitude_range": "Establecer rango de altitud (mt):",
      "reset": "Reiniciar"
    }
  }
</i18n>
