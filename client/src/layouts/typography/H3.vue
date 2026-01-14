<script setup lang="ts">
defineProps<{ noMargin?: boolean }>();
</script>

<template>
  <h3
    :class="[
      'scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight',
      noMargin ? 'm-0' : 'first:mt-0',
    ]"
  >
    <slot />
  </h3>
</template>
