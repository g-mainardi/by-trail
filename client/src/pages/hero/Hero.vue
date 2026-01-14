<script lang="ts">
export const description = 'Landing page.';
export default { name: 'Hero' };
</script>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import SelectLanguage from '@/components/ui/select/SelectLanguage.vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>

<template>
  <div
    class="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10"
    style="
      background-image: url('/src/assets/login-wallpaper.png');
      background-size: cover;
      background-position: center;
    "
  >
    <div class="absolute top-0 right-6">
      <SelectLanguage />
    </div>

    <div class="flex flex-col items-center">
      <div
        v-if="authStore.user"
        class="text-center flex flex-col items-center gap-6"
      >
        <h1 class="text-4xl font-bold text-white">
          {{ t('welcome_as') }} {{ authStore.user.name }}!
        </h1>
        <p class="text-white/80 text-lg">
          {{ t('logged_as') }} {{ authStore.user.email }}
        </p>

        <Button variant="destructive" @click="handleLogout">
          {{ t('logout') }}
        </Button>
      </div>

      <div v-else class="flex flex-col items-center">
        <h1 class="text-4xl font-bold text-white">{{ t('welcome') }}</h1>
        <div class="mt-6 flex gap-4">
          <RouterLink to="/login">
            <Button>{{ t('login') }}</Button>
          </RouterLink>
          <RouterLink to="/signup">
            <Button variant="secondary">{{ t('signup') }}</Button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "welcome": "Welcome to By Trail",
    "login": "Log In",
    "signup": "Sign Up",
    "logout": "Log Out",
    "logged_as": "You are logged in as ",
    "welcome_as": "Welcome, "
  },
  "it": {
    "welcome": "Benvenuto su By Trail",
    "login": "Accedi",
    "signup": "Registrati",
    "logout": "Disconnettiti",
    "logged_as": "Sei connesso come",
    "welcome_as": "Benvenuto, "
  },
  "es": {
    "welcome": "Bienvenido a By Trail",
    "login": "Iniciar sesión",
    "signup": "Registrarse",
    "logout": "Cerrar sesión",
    "logged_as": "Has iniciado sesión como",
    "welcome_as": "Bienvenido, "
  }
}
</i18n>
