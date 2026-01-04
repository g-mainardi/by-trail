<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import H1 from '@/layouts/typography/H1.vue';
import { useAuthStore } from '@/stores/auth';
import { AlertCircleIcon } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import DeleteAccountForm from './DeleteAccountForm.vue';
const { t } = useI18n();
const auth = useAuthStore();
</script>

<template>
  <H1 :text="t('delete_account_title')" class="mb-6" />
  <DeleteAccountForm />
  <Alert
    variant="destructive"
    v-if="auth.isAccountDeleteFailed"
    class="mt-2 w-[50%]"
  >
    <AlertCircleIcon />
    <AlertTitle>{{ t('delete_account_failed') }}</AlertTitle>
    <AlertDescription>Server: {{ auth.accountDeleteMessage }}</AlertDescription>
  </Alert>
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
