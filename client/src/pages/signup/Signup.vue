<script setup lang="ts">
import SelectLanguage from '@/components/ui/select/SelectLanguage.vue';
import SignupForm from '@/pages/signup/SignupForm.vue';
</script>

<template>
  <div
    class="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10"
  >
    <div class="absolute top-0 right-6">
      <SelectLanguage />
    </div>
    <div class="w-full max-w-sm">
      <SignupForm />
    </div>
  </div>
</template>
