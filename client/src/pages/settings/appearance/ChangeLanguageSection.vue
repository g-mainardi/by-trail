<script setup lang="ts">
import SelectLanguage from '@/components/ui/select/SelectLanguage.vue';
import H1 from '@/layouts/typography/H1.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col gap-4">
    <H1>{{ t('change_language') }}</H1>
    <SelectLanguage />
  </div>
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
