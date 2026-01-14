<script setup lang="ts">
import H1 from '@/layouts/typography/H1.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <H1 :text="t('paths_management')" />
</template>

<i18n>
{
  "en": {
    "paths_management": "Paths Management"
  },
  "it": {
    "paths_management": "Gestione Sentieri"
  },
  "es": {
    "paths_management": "Gestión de Senderos"
  }
}
</i18n>
