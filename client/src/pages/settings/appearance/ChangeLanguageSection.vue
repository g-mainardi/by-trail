<script setup lang="ts">
import SelectLanguage from '@/components/ui/select/SelectLanguage.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
</script>

<template>
  <div class="my-4">
    <h1 class="scroll-m-20 text-left font-mono text-4 tracking-tight text-balance">
      {{ t("change_language") }}
    </h1>
    <Separator orientation="horizontal" class="my-4" />
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