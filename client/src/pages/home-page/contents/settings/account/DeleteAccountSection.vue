<script setup lang="ts">
import DeleteAccountForm from '@/components/blocks/DeleteAccountForm.vue';
import { Alert, AlertTitle } from '@/components/ui/alert';
import Separator from '@/components/ui/separator/Separator.vue';
import { useAuthStore } from '@/stores/auth';
import { AlertCircleIcon } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const auth = useAuthStore();
</script>

<template>
  <div class="my-4">
    <h1 class="scroll-m-20 text-left font-mono text-4 tracking-tight text-balance">
      {{ t("delete_account_title") }}
    </h1>
    <Separator orientation="horizontal" class="my-4" />
    <DeleteAccountForm />
    <Alert variant="destructive" v-if="auth.isAccountDeleteFailed" class="mt-2 w-[33%]">
      <AlertCircleIcon />
      <AlertDescription>{{ auth.accountDeleteMessage }}</AlertDescription>
      <AlertTitle>{{ t("delete_account_failed") }}</AlertTitle>
    </Alert>
  </div>

</template>

<i18n>
  {
    "en": {
      "delete_account_title": "Delete Account",
      "delete_account_failed": "Unable to delete account."
    },
    "it": {
      "delete_account_title": "Elimina Account",
      "delete_account_failed": "Impossibile eliminare l'account."
    },
    "es": {
      "delete_account_title": "Eliminar Cuenta",
      "delete_account_failed": "No se pudo eliminar la cuenta."
    }
  }
</i18n>