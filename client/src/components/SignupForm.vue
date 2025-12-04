<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
const { t } = useI18n()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ t("signup") }}</CardTitle>
      <CardDescription>
        {{ t("description") }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel for="name">
              {{ t("name") }}
            </FieldLabel>
            <Input id="name" type="text" :placeholder="t('name_placeholder')" required />
          </Field>
          <Field>
            <FieldLabel for="email">
              {{ t("email") }}
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
            <FieldDescription>
              {{ t("email_description") }}
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel for="password">
              {{ t("password") }}
            </FieldLabel>
            <Input id="password" type="password" required />
            <FieldDescription>{{ t("password_description") }}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel for="confirm-password">
              {{ t("confirm_password") }}
            </FieldLabel>
            <Input id="confirm-password" type="password" required />
            <FieldDescription>{{ t("confirm_password_description") }}</FieldDescription>
          </Field>
          <FieldGroup>
            <Field>
              <Button type="submit">
                {{ t("create_account") }}
              </Button>
              <FieldDescription class="px-6 text-center">
                {{ t("have_account") }} <RouterLink to="/login">{{ t("log_in") }}</RouterLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>

<i18n>
{
  "en": {
    "signup": "Create an account",
    "description": "Enter your information below to create your account",
    "name": "Full Name",
    "email": "Email",
    "password": "Password",
    "confirm_password": "Confirm Password",
    "create_account": "Create Account",
    "have_account": "Already have an account?",
    "log_in": "Log in",
    "name_placeholder": "John Doe",
    "password_description": "Must be at least 8 characters long.",
    "confirm_password_description": "Please confirm your password."
  },
  "it": {
    "signup": "Crea un account",
    "description": "Inserisci le tue informazioni qui sotto per creare il tuo account",
    "name": "Nome completo",
    "email": "Email",
    "password": "Password",
    "confirm_password": "Conferma Password",
    "create_account": "Crea Account",
    "have_account": "Hai già un account?",
    "log_in": "Accedi",
    "name_placeholder": "Mario Rossi",
    "password_description": "Deve contenere almeno 8 caratteri.",
    "confirm_password_description": "Per favore conferma la tua password."
  },
  "es": {
    "signup": "Crea una cuenta",
    "description": "Introduce tu información a continuación para crear tu cuenta",
    "name": "Nombre completo",
    "email": "Correo electrónico",
    "password": "Contraseña",
    "confirm_password": "Confirmar contraseña",
    "create_account": "Crear cuenta",
    "have_account": "¿Ya tienes una cuenta?",
    "log_in": "Iniciar sesión",
    "name_placeholder": "Juan Pérez",
    "password_description": "Debe tener al menos 8 caracteres.",
    "confirm_password_description": "Por favor confirma tu contraseña."
  }
}
</i18n>