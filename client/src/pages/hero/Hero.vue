<script lang="ts">
export const description = "Landing page."
</script>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10" style="
      background-image: url('/src/assets/login-wallpaper.png'); 
      background-size: cover; 
      background-position: center;">
    <div class="flex flex-col items-center">
      <h1 class="text-4xl font-bold text-white">Welcome to By-Trail</h1>
      <div class="mt-6 flex gap-4">
      <RouterLink to="/login">
        <Button>Log In</Button>
      </RouterLink>
      <RouterLink to="/signup">
        <Button variant="secondary">Sign Up</Button>
      </RouterLink>
      </div>
    </div>
  </div>
</template>