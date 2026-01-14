<script setup lang="ts">
defineProps<{ noMargin?: boolean; text: string }>();
</script>

<template>
  <h1
    :class="[
      'scroll-m-20 text-left text-4xl font-extrabold tracking-tight text-balance',
      noMargin ? 'm-0' : 'first:mt-0',
    ]"
  >
    <slot />
  </h1>
</template>
