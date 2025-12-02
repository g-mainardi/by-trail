<script lang="ts">
export const description = "Landing page."
export default { name: 'Hero' };
</script>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import SelectLanguage from '@/components/ui/select/SelectLanguage.vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10" style="
      background-image: url('/src/assets/login-wallpaper.png'); 
      background-size: cover; 
      background-position: center;">
    <div class="absolute top-6 right-6">
      <SelectLanguage />
    </div>

    <div class="flex flex-col items-center">
      <h1 class="text-4xl font-bold text-white">{{ t("welcome") }}</h1>
      <div class="mt-6 flex gap-4">
      <RouterLink to="/login">
        <Button>{{ t("login") }}</Button>
      </RouterLink>
      <RouterLink to="/signup">
        <Button variant="secondary">{{ t("signup") }}</Button>
      </RouterLink>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "welcome": "Welcome to By-Trail",
    "login": "Log In",
    "signup": "Sign Up"
  },
  "it": {
    "welcome": "Benvenuto su By-Trail",
    "login": "Accedi",
    "signup": "Registrati"
  },
  "es": {
    "welcome": "Bienvenido a By-Trail",
    "login": "Iniciar sesión",
    "signup": "Registrarse"
  }
}
</i18n>