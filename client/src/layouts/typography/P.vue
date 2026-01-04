<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <p className="leading-7 not-first:mt-6">
    {{ text }}
  </p>
</template>
