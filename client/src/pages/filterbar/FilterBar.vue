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
  Calendar as CalendarIcon,
  Clock,
  Heart as HeartIcon,
  Mountain as MountainIcon,
  Search as SearchIcon,
  Settings2Icon,
  Toilet as ToiletIcon,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import {
  routeFilters,
  type BivouacFilter,
  type TrekkingRouteFilter,
} from './filters';
const { t } = useI18n();

defineProps<{
  bivouacFilters: {
    minDesiredBeds: BivouacFilter;
    altitudeFilter: BivouacFilter;
    searchQuery: BivouacFilter;
  };
  routeFilters: {
    maxDurationFilter: TrekkingRouteFilter;
    difficultyFilter: TrekkingRouteFilter;
  };
}>();
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <Button
        aria-label="Filter options"
        :class="[
          'fixed z-50 text-lg rounded-full shadow-lg py-6 px-12 group',
          $route.path.includes('maps') ? 'top-12 right-6' : 'top-4 right-4',
        ]"
      >
        <SearchIcon class="w-6 h-6" /><Settings2Icon class="w-6 h-6" />
      </Button>
    </SheetTrigger>

    <SheetContent>
      <SheetHeader>
        <SheetTitle>{{ t('filters') }}</SheetTitle>
        <SheetDescription>
          {{ t('bar_description') }}
        </SheetDescription>
      </SheetHeader>

      <!-- Bivouac filter options -->
      <div class="flex flex-col px-4 gap-4">
        <div
          v-if="
            $route.path.includes('maps') || $route.path.includes('bivouacs')
          "
          class="flex flex-col gap-4"
        >
          <h3>{{ t('bivouac_filters') }}</h3>
          <div class="flex items-center gap-2">
            <SearchIcon />
            <Input
              :placeholder="t('search')"
              v-model="bivouacFilters.searchQuery.currentValue"
            />
          </div>

          <div class="flex items-center gap-2">
            <BedIcon
              :fill="
                bivouacFilters.minDesiredBeds.currentValue >= 1
                  ? 'green'
                  : 'none'
              "
              :color="
                bivouacFilters.minDesiredBeds.currentValue >= 1
                  ? 'green'
                  : 'currentColor'
              "
            />
            <NumberField
              id="beds"
              :default-value="0"
              :min="0"
              v-model="bivouacFilters.minDesiredBeds.currentValue"
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
                bivouacFilters.altitudeFilter.currentValue.min >
                  bivouacFilters.altitudeFilter.default.min ||
                bivouacFilters.altitudeFilter.currentValue.max <
                  bivouacFilters.altitudeFilter.default.max
                  ? 'purple'
                  : 'none'
              "
            />
            Min
            <NumberField
              id="altitude-min"
              :default-value="bivouacFilters.altitudeFilter.default.min"
              :min="bivouacFilters.altitudeFilter.default.min"
              :max="bivouacFilters.altitudeFilter.default.max"
              v-model="bivouacFilters.altitudeFilter.currentValue.min"
            >
              <NumberFieldContent>
                <NumberFieldInput />
              </NumberFieldContent>
            </NumberField>
            Max
            <NumberField
              id="altitude-max"
              :default-value="bivouacFilters.altitudeFilter.default.max"
              :min="bivouacFilters.altitudeFilter.default.min"
              :max="bivouacFilters.altitudeFilter.default.max"
              v-model="bivouacFilters.altitudeFilter.currentValue.max"
            >
              <NumberFieldContent>
                <NumberFieldInput />
              </NumberFieldContent>
            </NumberField>
          </div>

          <Toggle
            variant="outline"
            aria-label="With toilets only"
            class="w-full"
          >
            <ToiletIcon />
            {{ t('with_toilets_only') }}
          </Toggle>

          <Toggle variant="outline" aria-label="Favorites only" class="w-full">
            <HeartIcon /> {{ t('favorites_only') }}
          </Toggle>

          <Toggle
            variant="outline"
            aria-label="Only open bivouacs"
            class="w-full"
          >
            <CalendarIcon /> {{ t('only_open') }}
          </Toggle>

          <Separator orientation="horizontal" />

          <Button
            variant="destructive"
            @click="$emit('resetBivouacFilters')"
            class="w-full"
            >{{ t('reset') }}</Button
          >
        </div>
      </div>

      <!-- Route filter options -->
      <div
        v-if="$route.path.includes('maps') || $route.path.includes('routes')"
        class="flex flex-col px-4 gap-4"
      >
        <h3>{{ t('route_filters') }}</h3>
        <div class="flex items-center gap-2 w-full">
          Difficulty:
          <Toggle
            variant="outline"
            class="w-full"
            v-model="routeFilters.difficultyFilter.currentValue.t"
          >
            T
          </Toggle>
          <Toggle
            variant="outline"
            class="w-full"
            v-model="routeFilters.difficultyFilter.currentValue.e"
            >E</Toggle
          >
          <Toggle
            variant="outline"
            class="w-full"
            v-model="routeFilters.difficultyFilter.currentValue.ee"
            >EE</Toggle
          >
          <Toggle
            variant="outline"
            class="w-full"
            v-model="routeFilters.difficultyFilter.currentValue.eea"
            >EEA</Toggle
          >
        </div>

        <div class="flex items-center gap-2 w-full">
          <Clock />
          <NumberField
            id="hour_duration"
            :default-value="6"
            :min="0"
            :step="1"
            v-model="routeFilters.maxDurationFilter.currentValue.hours"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
          h
          <NumberField
            id="min_duration"
            :default-value="0"
            :min="0"
            :step="15"
            v-model="routeFilters.maxDurationFilter.currentValue.minutes"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
          m
        </div>

        <Separator orientation="horizontal" />

        <Button
          variant="destructive"
          @click="$emit('resetRouteFilters')"
          class="w-full"
          >{{ t('reset') }}</Button
        >
      </div>
    </SheetContent>
  </Sheet>
</template>

<style scoped>
h3 {
  font-size: large;
}
</style>

<i18n>
  {
    en: {
      "search": "Search",
      "filters": "Filters",
      "bivouac_filters": "Bivouac Filters",
      "route_filters": "Route Filters",
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
      "bivouac_filters": "Filtri Bivacchi",
      "route_filters": "Filtri Percorsi",
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
      "bivouac_filters": "Filtros de Bivouacs",
      "route_filters": "Filtros de Routes",
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
