<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import Field from '@/components/ui/field/Field.vue';
import FieldGroup from '@/components/ui/field/FieldGroup.vue';
import FieldLabel from '@/components/ui/field/FieldLabel.vue';
import Input from '@/components/ui/input/Input.vue';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const password = ref('');
const authStore = useAuthStore();
const email = authStore.user?.email || '';

const handleDeleteAccount = async () => {
  if (!password.value) return;
  await authStore.deleteAccount(email, password.value);
};
</script>

<template>
  <form @submit.prevent="handleDeleteAccount">
    <FieldGroup class="w-full md:w-1/2">
      <Field>
        <FieldLabel> Email </FieldLabel>
        <span class="font-bold"> {{ email }} </span>
        <FieldLabel for="password">
          {{ t('password') }}
        </FieldLabel>
        <Input
          id="password"
          type="password"
          autocomplete="current-password"
          :placeholder="t('password_placeholder')"
          v-model="password"
          required
        />
      </Field>
      <Button type="submit" variant="destructive">
        {{ t('delete_account_button') }}
      </Button>
    </FieldGroup>
  </form>
</template>

<i18n>
  {
    "en": {
      "password": "Enter your password to confirm the deletion",
      "password_placeholder": "Enter your password here",
      "delete_account_button": "Delete"
    },
    "it": {
      "password": "Inserisci la tua password per confermare l'eliminazione",
      "password_placeholder": "Inserisci qui la tua password",
      "delete_account_button": "Elimina"
    },
    "es": {
      "password": "Introduce tu contraseña para confirmar la eliminación",
      "password_placeholder": "Introduce tu contraseña aquí",
      "delete_account_button": "Eliminar"
    }
  }
</i18n>
