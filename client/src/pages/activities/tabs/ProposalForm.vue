<script setup lang="ts">
import H1 from '@/layouts/typography/H1.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <H1 :text="t('make_a_proposal')" />
</template>

<i18n>
{
  "en": {
    "make_a_proposal": "Make a Proposal"
  },
  "it": {
    "make_a_proposal": "Fai una Proposta"
  },
  "es": {
    "make_a_proposal": "Haz una Propuesta"
  }
}
</i18n>
