<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../ui/button/Button.vue';
import Field from '../ui/field/Field.vue';
import FieldGroup from '../ui/field/FieldGroup.vue';
import FieldLabel from '../ui/field/FieldLabel.vue';
import Input from '../ui/input/Input.vue';
const { t } = useI18n()

const password = ref('')

const authStore = useAuthStore()

const handleDeleteAccount = async () => {
  if (!password.value) return;
  await authStore.deleteAccount(password.value);
}
</script>

<template>
  <form @submit.prevent="handleDeleteAccount">
    <FieldGroup class="w-[33%]">
      <Field>
        <FieldLabel for="password">
          {{ t("password_label") }}
        </FieldLabel>
        <Input 
          id="password" 
          type="password" 
          v-model="password"
          required 
        />
      </Field>
      <Button type="submit" variant="destructive">
        {{ t("delete_account_button") }}
      </Button>
    </FieldGroup>
  </form>
</template>

<i18n>
  {
    "en": {
      "password_label": "Password",
      "delete_account_button": "Delete"
    },
    "it": {
      "password_label": "Password",
      "delete_account_button": "Elimina"
    },
    "es": {
      "password_label": "Contraseña",
      "delete_account_button": "Eliminar"
    }
  }
</i18n>