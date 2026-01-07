<script setup lang="ts">
import H1 from '@/layouts/typography/H1.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <H1 :text="t('saved_routes')" />
</template>

<i18n>
{
  "en": {
    "saved_routes": "Saved Routes"
  },
  "it": {
    "saved_routes": "Percorsi Salvati"
  },
  "es": {
    "saved_routes": "Rutas Guardadas"
  }
}
</i18n>
