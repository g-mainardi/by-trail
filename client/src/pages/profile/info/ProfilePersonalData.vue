<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// --- UI Components ---
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import FieldLabel from '@/components/ui/field/FieldLabel.vue';
import { FieldGroup } from '@/components/ui/field';
import P from '@/layouts/typography/P.vue';
import FieldDescription from '@/components/ui/field/FieldDescription.vue';
import H3 from '@/layouts/typography/H3.vue';

const { t } = useI18n();

const props = defineProps<{
  email: string;
  modelValue: string;
  readOnlyFullName: string;
}>();

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <Card class="h-full border-none shadow-md">
    <CardHeader>
      <CardTitle>{{ t('personal_data') }}</CardTitle>
      <CardDescription>{{ t('personal_data_description') }}</CardDescription>
    </CardHeader>
    <CardContent>
      <div
        class="flex flex-col items-center justify-center gap-4 py-4 sm:flex-row sm:justify-start"
      >
        <Avatar class="w-24 h-24 border-4 border-muted">
          <AvatarFallback class="text-2xl">{{
            readOnlyFullName?.charAt(0).toUpperCase()
          }}</AvatarFallback>
        </Avatar>
        <div class="text-center sm:text-left">
          <H3 :noMargin="true">{{
            readOnlyFullName || t('username_placeholder')
          }}</H3>
          <P :noMargin="true">{{ email }}</P>
        </div>
      </div>

      <Separator class="my-4" />

      <FieldGroup>
        <div class="flex flex-col gap-1.5">
          <FieldLabel for="name">{{ t('your_name') }}</FieldLabel>
          <Input
            id="name"
            :model-value="modelValue"
            @update:model-value="(val) => emit('update:modelValue', val)"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <FieldLabel for="email">Email</FieldLabel>
          <Input id="email" :model-value="email" disabled class="bg-muted/50" />
          <FieldDescription>{{ t('unmodifiable_email') }}</FieldDescription>
        </div>
      </FieldGroup>
    </CardContent>
  </Card>
</template>

<i18n>
    {
  "en": {
    "personal_data": "Personal Details",
    "personal_data_description": "Your login data and public identity.",
    "your_name": "Full name",
    "unmodifiable_email": "Your email cannot be modified.",
    "username_placeholder": "Username"
  },
  "it": {
    "personal_data": "Dati Personali",
    "personal_data_description": "I tuoi dati di accesso e identità pubblica.",
    "your_name": "Nome completo",
    "unmodifiable_email": "La tua email non può essere modificata.",
    "username_placeholder": "Nome utente"
  },
  "es": {
    "personal_data": "Datos Personales",
    "personal_data_description": "Tus datos de acceso e identidad pública.",
    "your_name": "Nombre completo",
    "unmodifiable_email": "Tu correo electrónico no se puede modificar.",
    "username_placeholder": "Nombre de usuario"
  }
}
</i18n>
