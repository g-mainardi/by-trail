<script setup lang="ts">
import H1 from '@/layouts/typography/H1.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <H1>{{ t('alerts_management') }}</H1>
</template>

<i18n>
{
  "en": {
    "alerts_management": "Alerts Management"
  },
  "it": {
    "alerts_management": "Gestione Segnalazioni"
  },
  "es": {
    "alerts_management": "Gestión de Alertas"
  }
}
</i18n>
