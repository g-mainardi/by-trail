<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// --- UI Components ---
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const { t } = useI18n();

const props = defineProps<{
  email: string;
  modelValue: string;
  name: string;
}>();

const emit = defineEmits(['update:modelValue']);

</script>

<template>
  <Card class="h-full border-none shadow-md">
    <CardHeader>
      <CardTitle>{{ t("personal_data") }}</CardTitle>
      <CardDescription>{{t("personal_data_description")}}</CardDescription>
    </CardHeader>
    <CardContent class="space-y-6">

      <div class="flex flex-col items-center justify-center gap-4 py-4 sm:flex-row sm:justify-start">
          <Avatar class="w-24 h-24 border-4 border-muted">
          <AvatarFallback class="text-2xl">{{ name?.charAt(0).toUpperCase() }}</AvatarFallback>
          </Avatar>
          <div class="text-center sm:text-left">
          <h3 class="text-lg font-medium">{{ name || t("username_placeholder") }}</h3>
          <p class="text-sm text-muted-foreground">{{ email }}</p>
          </div>
      </div>

      <Separator class="my-4" />

      <div class="space-y-2">
          <Label for="name">{{ t("your_name") }}</Label>
          <Input id="name" :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)" class="h-10" />
      </div>

      <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input id="email" :model-value="email" @update:model-value="val => emit('update:modelValue', val)" disabled class="bg-muted/50" />
          <p class="text-[0.8rem] text-muted-foreground">{{t("unmodifiable_email")}}</p>
      </div>

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