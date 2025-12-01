<script lang="ts">
export const description = "A simple login form."
</script>

<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue";
</script>

<template>
  <div 
    class="flex min-h-svh w-full items-center justify-center p-6 md:p-10" 
    style="
      background-image: url('/src/assets/login-wallpaper.png'); 
      background-size: cover; 
      background-position: center;"
  >
    <div class="w-full max-w-sm">
      <LoginForm />
    </div>
  </div>
</template>

