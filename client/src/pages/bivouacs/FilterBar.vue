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
import { Toggle } from '@/components/ui/toggle';
import { Bed, Calendar, Heart, Mountain, Toilet } from 'lucide-vue-next';

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
  <Bed :fill="filters.desiredBeds > 0 ? 'green' : 'none'" :color="filters.desiredBeds > 0 ? 'green' : 'currentColor'" />
  <NumberField id="beds" :default-value="0" :min="0" v-model="filters.desiredBeds">
  <NumberFieldContent>
    <NumberFieldDecrement />
    <NumberFieldInput />
    <NumberFieldIncrement />
  </NumberFieldContent>
  </NumberField>
  <Separator orientation="vertical" />
  <Toggle variant="outline" aria-label="With toilets only" v-model="filters.withToiletsOnly">
    <Toilet :fill="filters.withToiletsOnly ? 'blue' : 'none'" :color="filters.withToiletsOnly ? 'blue' : 'currentColor'" />
  </Toggle>
  <Separator orientation="vertical" />
  <Toggle variant="outline" aria-label="Favorites only" v-model="filters.favoritesOnly">
    <Heart :fill="filters.favoritesOnly ? 'red' : 'none'" :color="filters.favoritesOnly ? 'red' : 'currentColor'" />
  </Toggle>
  <Separator orientation="vertical" />
  <Mountain :fill="(filters.minAltitude > 0 || filters.maxAltitude < 5000) ? 'purple' : 'none'" :color="(filters.minAltitude > 0 || filters.maxAltitude < 5000) ? 'purple' : 'currentColor'" />
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
  <Separator orientation="vertical" />
  <Toggle variant="outline" aria-label="Only open" v-model="filters.onlyOpen">
    <Calendar :fill="filters.onlyOpen ? 'orange' : 'none'" :color="filters.onlyOpen ? 'orange' : 'currentColor'" />
  </Toggle>
  <Separator orientation="vertical" />
  <Button variant="outline" @click="$emit('reset')">Reset</Button>
</template>