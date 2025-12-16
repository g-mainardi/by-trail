<script setup lang="ts">
import SelectLanguage from '@/components/ui/select/SelectLanguage.vue';
import { useI18n } from 'vue-i18n';
import SectionTitle from '../account/SectionTitle.vue';
const { t } = useI18n()
</script>

<template>
  <SectionTitle :title="t('change_language')" />
  <SelectLanguage />
</template>

<i18n>
  {
    "en": {
      "change_language": "Change Language"
    },
    "it": {
      "change_language": "Cambia Lingua"
    },
    "es": {
      "change_language": "Cambiar Idioma"
    }
  }
</i18n>