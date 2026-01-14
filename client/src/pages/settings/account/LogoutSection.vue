<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';
import SectionTitle from './SectionTitle.vue';
const { t } = useI18n();
const authStore = useAuthStore();
</script>

<template>
  <div class="my-4">
    <SectionTitle :title="t('session_title')" />
    <Button variant="outline" @click="authStore.logout()">{{
      t('logout_button')
    }}</Button>
  </div>
</template>

<i18n>
  {
    "en": {
      "session_title": "Session",
      "logout_button": "Logout"
    },
    "it": {
      "session_title": "Sessione",
      "logout_button": "Disconnettersi"
    },
    "es": {
      "session_title": "Sesión",
      "logout_button": "Cerrar sesión"
    }
  }
</i18n>
