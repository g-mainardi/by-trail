<script setup lang="ts">
defineProps<{
  path: string,
  size?: number
}>();
</script>

<template>
  <img :src="path" :width="size ? size * 16 : 24" :height="size ? size * 16 : 24" alt="icon" />
</template>