<script setup lang="ts">
import H1 from '@/layouts/typography/H1.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
</script>

<template>
  <H1 :text="t('bivouacs_management')" />
</template>


<i18n>
{
  "en": {
    "bivouacs_management": "Bivouacs Management"
  },
  "it": {
    "bivouacs_management": "Gestione Bivacchi"
  },
  "es": {
    "bivouacs_management": "Gestión de Vivacs"
  }
}
</i18n>