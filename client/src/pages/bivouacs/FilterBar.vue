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
import { Toggle } from '@/components/ui/toggle';
import { Bed, Calendar, Heart, Mountain, Settings2Icon, Toilet } from 'lucide-vue-next';

defineProps<{
  filters: {
    desiredBeds: number;
    withToiletsOnly: boolean;
    favoritesOnly: boolean;
    minAltitude: number;
    maxAltitude: number;
    onlyOpen: boolean;
  };
}>();
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <Button variant="outline" aria-label="Filter options">
        <Settings2Icon /> Filters
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Filter Options</SheetTitle>
        <SheetDescription>
          Use the filters below to narrow down your search for bivouacs.
        </SheetDescription>
      </SheetHeader>
      
      <!-- Filter options -->
      <div class="flex flex-col px-4">

        <div class="altitude-label flex items-center gap-2 mb-2">
          <Bed :fill="filters.desiredBeds > 0 ? 'green' : 'none'" :color="filters.desiredBeds > 0 ? 'green' : 'currentColor'" />
          Set minimum beds:
        </div>
        <div class="beds-filter flex items-center gap-2">
          <NumberField id="beds" :default-value="0" :min="0" v-model="filters.desiredBeds" class="w-full">
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>

        <Separator orientation="horizontal" class="my-4" />

        <Toggle variant="outline" aria-label="With toilets only" v-model="filters.withToiletsOnly" class="w-full">
          <Toilet :fill="filters.withToiletsOnly ? 'blue' : 'none'" :color="filters.withToiletsOnly ? 'blue' : 'currentColor'" />
          With Toilets Only
        </Toggle>

        <Separator orientation="horizontal" class="my-4"/>

        <Toggle variant="outline" aria-label="Favorites only" v-model="filters.favoritesOnly" class="w-full">
          <Heart :fill="filters.favoritesOnly ? 'red' : 'none'" :color="filters.favoritesOnly ? 'red' : 'currentColor'" />
          Favorites Only
        </Toggle>

        <Separator orientation="horizontal" class="my-4"/>

        <div class="altitude-label flex items-center gap-2 mb-2">
          <Mountain :fill="(filters.minAltitude > 0 || filters.maxAltitude < 5000) ? 'purple' : 'none'" :color="(filters.minAltitude > 0 || filters.maxAltitude < 5000) ? 'purple' : 'currentColor'" />
          Set Altitude Range:
        </div>
        <div class="altitude-filter flex items-center gap-2">
          <NumberField id="altitude-min" :default-value="0" :min="0" :max="5000" v-model="filters.minAltitude">
            <NumberFieldContent>
              <NumberFieldInput />
            </NumberFieldContent>
          </NumberField>
          -
          <NumberField id="altitude-max" :default-value="5000" :min="0" :max="5000" v-model="filters.maxAltitude">
            <NumberFieldContent>
              <NumberFieldInput />
            </NumberFieldContent>
          </NumberField>
        </div>

        <Separator orientation="horizontal" class="my-4"/>

        <Toggle variant="outline" aria-label="Only open" v-model="filters.onlyOpen" class="w-full">
          <Calendar :fill="filters.onlyOpen ? 'orange' : 'none'" :color="filters.onlyOpen ? 'orange' : 'currentColor'" />
          Only Open
        </Toggle>

        <Separator orientation="horizontal" class="my-4" />

        <Button variant="secondary" @click="$emit('reset')" class="w-full">Reset</Button>
      </div>
    </SheetContent>
  </Sheet>

  
</template>