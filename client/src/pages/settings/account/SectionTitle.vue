<script setup lang="ts">
import Separator from '@/components/ui/separator/Separator.vue';

defineProps<{
  title: string;
}>();
</script>

<template>
  <h1
    class="scroll-m-20 text-left text-6 font-bold tracking-tight text-balance"
  >
    {{ title }}
  </h1>
  <Separator orientation="horizontal" class="mb-4" />
</template>
