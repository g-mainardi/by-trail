<script setup lang="ts">
import H1 from '@/layouts/typography/H1.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <H1 :text="t('saved_bivouacs')" />
</template>

<i18n>
{
  "en": {
    "saved_bivouacs": "Saved Bivouacs"
  },
  "it": {
    "saved_bivouacs": "Bivacchi Salvati"
  },
  "es": {
    "saved_bivouacs": "Bivouacs Guardados"
  }
}
</i18n>
