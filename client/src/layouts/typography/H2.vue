<script setup lang="ts">
defineProps<{ noMargin?: boolean }>();
</script>

<template>
  <h2
    :class="[
      'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight',
      noMargin ? 'm-0' : 'first:mt-0',
    ]"
  >
    <slot />
  </h2>
</template>
