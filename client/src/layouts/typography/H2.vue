<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <h2
    className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
  >
    {{ text }}
  </h2>
</template>
