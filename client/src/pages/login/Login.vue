<script lang="ts">
export const description = 'A simple login form.';
export default { name: 'Login' };
</script>

<script setup lang="ts">
import SelectLanguage from '@/components/ui/select/SelectLanguage.vue';
import LoginForm from '@/pages/login/LoginForm.vue';
</script>

<template>
  <div
    class="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10"
  >
    <div class="absolute top-0 right-6">
      <SelectLanguage />
    </div>
    <div class="w-full max-w-sm">
      <LoginForm />
    </div>
  </div>
</template>
