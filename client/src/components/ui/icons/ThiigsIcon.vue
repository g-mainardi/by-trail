<script setup lang="ts">
defineProps<{
  alt?: string,
  path: string,
  size?: number
}>();
</script>

<template>
  <img :src="path" :width="size ? size * 16 : 24" :height="size ? size * 16 : 24" :alt="alt" />
</template>