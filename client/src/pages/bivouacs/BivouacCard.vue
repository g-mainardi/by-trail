<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Eye, Heart } from 'lucide-vue-next';
import type { Bivouac } from './Bivouacs.vue';

defineProps<{
  bivouac: Bivouac
}>();

</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ bivouac.name }}</CardTitle>
    </CardHeader>
    <CardContent>
      {{ bivouac.description }}
    </CardContent>
    <CardFooter>
      <div class="flex-1 flex gap-2 flex-wrap">
        <Button>
          <Eye />View Details
        </Button>
        <Button variant="outline" @click="$emit('toggle-favorite')">
          <Heart :fill="bivouac.favorite ? 'red' : 'none'" :color="bivouac.favorite ? 'red' : 'currentColor'" />Favorite
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>