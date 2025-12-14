<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle
} from '@/components/ui/card';
import ThiigsIcon from '@/components/ui/icons/MyIcon.vue';
import { Eye, Heart, Star } from 'lucide-vue-next';
import type { Bivouac } from './Bivouacs.vue';

const hoodHousePath = new URL('@/assets/trekking_hood_house.png', import.meta.url).href;
const mountainHouse = new URL('@/assets/trekking_mountain_house.png', import.meta.url).href;
const tentSiteIcon = new URL('@/assets/trekking_tent.png', import.meta.url).href;
const cliffHouseIcon = new URL('@/assets/trekking_cliff_house.png', import.meta.url).href;
const mountain = new URL('@/assets/mountain.png', import.meta.url).href;
const beds = new URL('@/assets/beds.png', import.meta.url).href;
const toilet = new URL('@/assets/toilet.png', import.meta.url).href;
const calendar = new URL('@/assets/calendar.png', import.meta.url).href;

const props = defineProps<{
  bivouac: Bivouac
}>();

function toggleFavorite() {
  props.bivouac.favorite = !props.bivouac.favorite;
  // TODO: notify parent component or make API call to persist change
}

function getIconPath() {
  switch (props.bivouac.type) {
    case 'bivouac': return hoodHousePath;
    case 'refuge': return mountainHouse;
    case 'cliff-house': return cliffHouseIcon;
    case 'tent-site': return tentSiteIcon;
    default: return hoodHousePath;
  }
}

function checkAvailability(): boolean {
  // Placeholder logic for availability
  // TODO: below there is a mock logic
  const hour = new Date().getHours();
  return hour >= 8 && hour <= 20;
}
</script>

<template>
  <Card class="gap-2 py-4">
    <CardTitle class="flex items-center gap-4 px-6">
      <ThiigsIcon :path="getIconPath()" :size="6" />
      <h1 class="text-2xl font-bold">
        {{ bivouac.name }}
      </h1>
    </CardTitle>
    <CardContent class="flex items-center justify-between gap-4 ">
      <span class="w-[50%]">
        {{ bivouac.description }}
      </span>
      <div class="icons flex gap-4 w-[50%] justify-evenly">
        <div class="icon1 flex flex-col">
          <ThiigsIcon :path="mountain" :size="4" />
            <span class="text-center font-mono text-sm">{{ bivouac.altitude }}</span>
        </div>
        <div class="icon2 flex flex-col">
          <ThiigsIcon :path="beds" :size="4" />
          <span class="text-center font-mono text-sm">{{ bivouac.capacity }}</span>
        </div>
        <div class="icon3 flex flex-col">
          <ThiigsIcon :path="toilet" :size="4" />
          <span class="text-center font-mono text-sm">
            {{ bivouac.hasToilets ? 'Yes' : 'No' }}
          </span>
        </div>
        <div class="icon4 flex flex-col">
          <ThiigsIcon :path="calendar" :size="4" />
          <span class="text-center font-mono text-sm">
            {{ checkAvailability() ? 'Open' : 'Closed' }}
          </span>
        </div>
      </div>
    </CardContent>
    <CardFooter class="flex gap-2 px-6">
      <Button class="flex-1">
        <Eye />
        <span class="hidden md:inline">View</span>
      </Button>
      <Button variant="secondary" class="flex-1" @click="toggleFavorite">
        <Heart
          :fill="bivouac.favorite ? 'red' : 'none'"
          :color="bivouac.favorite ? 'red' : 'currentColor'"
        />
        <span class="hidden md:inline">Favorite</span>
      </Button>
      <Button variant="outline" class="flex-1">
        <Star />
        <span class="hidden md:inline">Book Now</span>
      </Button>
    </CardFooter>

  </Card>
</template>
