<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field';
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue';
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
  Clock as ClockIcon,
  Settings2Icon,
  TrendingUp as TrendingUpIcon,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import type { RouteFilter } from '../filterbar/filters';
const { t } = useI18n();

defineProps<{
  filters: {
    maxDuration: RouteFilter;
    difficulty: RouteFilter;
  };
}>();

const difficulties = ['All', 'T', 'E', 'EE', 'EEA'];
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <Button variant="outline" aria-label="Filter options">
        <Settings2Icon class="mr-2 h-4 w-4" />{{ t('filters') }}
      </Button>
    </SheetTrigger>
    <SheetContent>
      <ScrollArea>
        <SheetHeader>
          <SheetTitle>{{ t('filters') }}</SheetTitle>
          <SheetDescription>
            {{ t('bar_description') }}
          </SheetDescription>
        </SheetHeader>

        <!-- Filter options -->
        <div class="flex flex-col px-4 mt-6">
          <div class="duration-label flex items-center gap-2 mb-2">
            <ClockIcon
              :class="
                filters.maxDuration.currentValue < filters.maxDuration.default
                  ? 'text-green-600'
                  : ''
              "
            />
            {{ t('max_duration') }}
          </div>
          <div class="duration-filter flex items-center gap-2">
            <NumberField
              id="duration"
              :default-value="24"
              :min="1"
              v-model="filters.maxDuration.currentValue"
              class="w-full"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>
          <p class="text-xs text-muted-foreground mt-1 text-right">
            {{ t('hours') }}
          </p>

          <Separator orientation="horizontal" class="my-4" />

          <!-- <Toggle variant="outline" aria-label="With toilets only" v-model="filters.withToiletsOnly" class="w-full">
          <ToiletIcon :fill="filters.withToiletsOnly ? 'blue' : 'none'" :color="filters.withToiletsOnly ? 'blue' : 'currentColor'" />
          {{ t('with_toilets_only') }}
        </Toggle> -->

          <!-- <Toggle variant="outline" aria-label="Favorites only" v-model="filters.favoritesOnly" class="w-full">
          <HeartIcon :fill="filters.favoritesOnly ? 'red' : 'none'" :color="filters.favoritesOnly ? 'red' : 'currentColor'" />
          {{ t('favorites_only') }}
        </Toggle> -->

          <div class="difficulty-label flex items-center gap-2 mb-2">
            <TrendingUpIcon
              class="h-4 w-4"
              :class="
                filters.difficulty.currentValue !== 'All'
                  ? 'text-purple-600'
                  : ''
              "
            />
            {{ t('difficulty') }}
          </div>

          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="diff in difficulties"
              :key="diff"
              @click="filters.difficulty.currentValue = diff"
              class="flex items-center justify-center rounded-md border p-2 text-sm transition-colors hover:bg-accent"
              :class="
                filters.difficulty.currentValue === diff
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background'
              "
            >
              {{ diff === 'All' ? t('all') : diff }}
            </button>
          </div>
          <p class="text-xs text-muted-foreground mt-2">
            T (Tourist), E (Hiker), EE (Expert), EEA (Equipped)
          </p>

          <Separator orientation="horizontal" class="my-4" />

          <!-- <Toggle variant="outline" aria-label="Only open" v-model="filters.onlyOpen" class="w-full">
          <CalendarIcon :fill="filters.onlyOpen ? 'orange' : 'none'" :color="filters.onlyOpen ? 'orange' : 'currentColor'" />
          {{ t('only_open') }}
        </Toggle> -->

          <Button
            variant="destructive"
            @click="$emit('reset')"
            class="w-full"
            >{{ t('reset') }}</Button
          >
        </div>
      </ScrollArea>
    </SheetContent>
  </Sheet>
</template>

<i18n>
 {
    "en": {
      "filters": "Filters",
      "bar_description": "Filter routes by duration and difficulty.",
      "max_duration": "Max Duration",
      "difficulty": "Difficulty",
      "hours": "Hours",
      "all": "All",
      "reset": "Reset Filters"
    },
    "it": {
      "filters": "Filtri",
      "bar_description": "Filtra i percorsi per durata e difficoltà.",
      "max_duration": "Durata Massima",
      "difficulty": "Difficoltà",
      "hours": "Ore",
      "all": "Tutti",
      "reset": "Reimposta"
    },
    "es": {
      "filters": "Filtros",
      "bar_description": "Filtrar rutas por duración y dificultad.",
      "max_duration": "Duración Máxima",
      "difficulty": "Dificultad",
      "hours": "Horas",
      "all": "Todos",
      "reset": "Reiniciar"
    }
  }
</i18n>
