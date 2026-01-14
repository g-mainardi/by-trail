<script setup lang="ts">
import H1 from '@/layouts/typography/H1.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <H1 :text="t('users_management')" />
</template>

<i18n>
{
  "en": {
    "users_management": "Users Management"
  },
  "it": {
    "users_management": "Gestione Utenti"
  },
  "es": {
    "users_management": "Gestión de Usuarios"
  }
}
</i18n>
