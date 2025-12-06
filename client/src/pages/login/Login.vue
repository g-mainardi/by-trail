<script lang="ts">
export const description = "A simple login form."
export default { name: 'Login' };
</script>

<script setup lang="ts">
import LoginForm from "@/components/blocks/LoginForm.vue";
import SelectLanguage from '@/components/ui/select/SelectLanguage.vue';
</script>

<template>
  <div 
    class="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10" 
    style="
      background-image: url('/src/assets/login-wallpaper.png'); 
      background-size: cover; 
      background-position: center;"
  >
    <div class="absolute top-0 right-6">
      <SelectLanguage />
    </div>
    <div class="w-full max-w-sm">
      <LoginForm />
    </div>
  </div>
</template>

