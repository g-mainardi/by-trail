<script setup lang="ts">
import { Button } from '@/components/ui/button';
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
import {
  Bed as BedIcon,
  Mountain as MountainIcon,
  Settings2Icon,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import type { Filter } from './Bivouacs.vue';
const { t } = useI18n();

defineProps<{
  filters: {
    minDesiredBeds: Filter;
    altitudeFilter: Filter;
  };
}>();
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <Button
        variant="outline"
        aria-label="Filter options"
        class="fixed bottom-4 right-4 z-50 text-lg px-6 py-6"
      >
        <Settings2Icon class="w-6 h-6" /> {{ t('filters') }}
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
      <div class="flex flex-col px-4">
        <div class="beds-label flex items-center gap-2 mb-2">
          <BedIcon
            :fill="filters.minDesiredBeds.currentValue >= 1 ? 'green' : 'none'"
            :color="
              filters.minDesiredBeds.currentValue >= 1
                ? 'green'
                : 'currentColor'
            "
          />
          {{ t('set_minimum_beds') }}
        </div>
        <div class="beds-filter flex items-center gap-2">
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

        <Separator orientation="horizontal" class="my-4" />

        <!-- <Toggle variant="outline" aria-label="With toilets only" v-model="filters.withToiletsOnly" class="w-full">
          <ToiletIcon :fill="filters.withToiletsOnly ? 'blue' : 'none'" :color="filters.withToiletsOnly ? 'blue' : 'currentColor'" />
          {{ t('with_toilets_only') }}
        </Toggle> -->

        <!-- <Toggle variant="outline" aria-label="Favorites only" v-model="filters.favoritesOnly" class="w-full">
          <HeartIcon :fill="filters.favoritesOnly ? 'red' : 'none'" :color="filters.favoritesOnly ? 'red' : 'currentColor'" />
          {{ t('favorites_only') }}
        </Toggle> -->

        <div class="altitude-label flex items-center gap-2 mb-2">
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
          {{ t('set_altitude_range') }}
        </div>

        <div class="altitude-filter flex items-center gap-2">
          <NumberField
            id="altitude-min"
            :default-value="filters.altitudeFilter.default.min"
            :min="filters.altitudeFilter.default.min"
            :max="filters.altitudeFilter.default.max"
            v-model="filters.altitudeFilter.currentValue.min"
            class="w-full"
          >
            <NumberFieldContent>
              <NumberFieldInput />
            </NumberFieldContent>
          </NumberField>
          -
          <NumberField
            id="altitude-max"
            :default-value="filters.altitudeFilter.default.max"
            :min="filters.altitudeFilter.default.min"
            :max="filters.altitudeFilter.default.max"
            v-model="filters.altitudeFilter.currentValue.max"
            class="w-full"
          >
            <NumberFieldContent>
              <NumberFieldInput />
            </NumberFieldContent>
          </NumberField>
        </div>

        <Separator orientation="horizontal" class="my-4" />

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
      "filters": "Filters",
      "bar_description": "Use the filters below to narrow down your search for bivouacs.",
      "with_toilets_only": "With Toilets Only",
      "favorites_only": "Favorites Only",
      "only_open": "Only Open",
      "set_minimum_beds": "Set minimum beds:",
      "set_altitude_range": "Set Altitude Range:",
      "reset": "Reset"
    },
    it: {
      "filters": "Filtri",
      "bar_description": "Usa i filtri qui sotto per restringere la ricerca dei bivacchi.",
      "with_toilets_only": "Solo con servizi igienici",
      "favorites_only": "Solo Preferiti",
      "only_open": "Solo Aperto",
      "set_minimum_beds": "Imposta letti minimi:",
      "set_altitude_range": "Imposta intervallo di altitudine:",
      "reset": "Reimposta"
    },
    es: {
      "filters": "Filtros",
      "bar_description": "Utiliza los filtros a continuación para reducir tu búsqueda de bivouacs.",
      "with_toilets_only": "Solo con baños",
      "favorites_only": "Solo Favoritos",
      "only_open": "Solo Abierto",
      "set_minimum_beds": "Establecer camas mínimas:",
      "set_altitude_range": "Establecer rango de altitud:",
      "reset": "Reiniciar"
    }
  }
</i18n>
