<script setup lang="ts">
defineProps<{ noMargin?: boolean }>();
</script>

<template>
  <p :class="['leading-7', noMargin ? 'm-0' : 'not-first:mt-6']">
    <slot />
  </p>
</template>
