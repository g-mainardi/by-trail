<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <h1
    class="scroll-m-20 text-left text-4xl font-extrabold tracking-tight text-balance"
  >
    {{ text }}
  </h1>
</template>
