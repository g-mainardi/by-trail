<script setup lang="ts">
import DeleteAccountForm from '@/components/blocks/DeleteAccountForm.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
</script>

<template>
  <div class="my-4">
    <h1 class="scroll-m-20 text-left font-mono text-4 tracking-tight text-balance">
      {{ t("delete_account_title") }}
    </h1>
    <Separator orientation="horizontal" class="my-4" />
    <DeleteAccountForm />
  </div>
</template>

<i18n>
  {
    "en": {
      "delete_account_title": "Delete Account"
    },
    "it": {
      "delete_account_title": "Elimina Account"
    },
    "es": {
      "delete_account_title": "Eliminar Cuenta"
    }
  }
</i18n>