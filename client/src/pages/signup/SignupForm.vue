<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth';
import { AlertCircle } from 'lucide-vue-next'; // Import Error Icon
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
const { t } = useI18n();

const authStore = useAuthStore();

// Reactive state for form inputs
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const validationError = ref<string | null>(null); // Local error (e.g. passwords do not match)

const handleSignup = async () => {
  // Resets previous validation error
  validationError.value = null;

  // Prevent empty submission
  if (
    !name.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    validationError.value = t('signup_fill_all_fields');
    return;
  }

  // Check password
  if (password.value !== confirmPassword.value) {
    validationError.value = t('signup_passwords_do_not_match');
    return;
  }
  // Password complexity validation
  if (
    password.value.length < 8 ||
    !/[A-Z]/.test(password.value) ||
    !/[a-z]/.test(password.value) ||
    !/[0-9]/.test(password.value)
  ) {
    validationError.value = t('signup_passwords_requirements');
    return;
  }

  // Call backend through Pinia store
  await authStore.signup(name.value, email.value, password.value);
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ t('signup') }}</CardTitle>
      <CardDescription>
        {{ t('description') }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSignup">
        <Alert
          v-if="validationError || authStore.error"
          variant="destructive"
          class="mb-6"
        >
          <AlertCircle class="h-4 w-4" />
          <AlertTitle>{{ t('error') }}</AlertTitle>
          <AlertDescription>
            {{ validationError || authStore.error }}
          </AlertDescription>
        </Alert>

        <FieldGroup>
          <Field>
            <FieldLabel for="name">
              {{ t('name') }}
            </FieldLabel>
            <Input
              id="name"
              v-model="name"
              type="text"
              :placeholder="t('name_placeholder')"
              required
            />
          </Field>
          <Field>
            <FieldLabel for="email">
              {{ t('email') }}
            </FieldLabel>
            <Input
              id="email"
              v-model="email"
              type="email"
              autocomplete="username"
              placeholder="m@example.com"
              required
            />
            <FieldDescription>
              {{ t('email_description') }}
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel for="password">
              {{ t('password') }}
            </FieldLabel>
            <Input
              id="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              :placeholder="t('password_placeholder')"
              required
            />
            <FieldDescription>{{ t('password_description') }}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel for="confirm-password">
              {{ t('confirm_password') }}
            </FieldLabel>
            <Input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              :placeholder="t('password_confirm_placeholder')"
              required
            />
            <FieldDescription>{{
              t('confirm_password_description')
            }}</FieldDescription>
          </Field>
          <FieldGroup>
            <Field>
              <Button type="submit" :disabled="authStore.isLoading">
                {{
                  authStore.isLoading
                    ? t('creating_account')
                    : t('create_account')
                }}
              </Button>
              <FieldDescription class="px-6 text-center">
                {{ t('have_account') }}
                <RouterLink to="/login">{{ t('log_in') }}</RouterLink>
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
    "error": "Error",
    "signup": "Create an account",
    "description": "Enter your information below to create your account",
    "name": "Full Name",
    "email": "Email",
    "password": "Password",
    "confirm_password": "Confirm Password",
    "create_account": "Create Account",
    "creating_account": "Creating account...",
    "have_account": "Already have an account?",
    "log_in": "Log in",
    "name_placeholder": "John Doe",
    "password_placeholder": "Enter your password here",
    "password_description": "Must be at least 8 characters long.",
    "password_confirm_placeholder": "Re-enter your password",
    "confirm_password_description": "Please confirm your password.",
    "email_description": "We'll never share your email with anyone else.",  
    "signup_fill_all_fields": "Please fill in all fields.",
    "signup_passwords_do_not_match": "Passwords do not match.",
    "signup_passwords_requirements": "Password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers."
  },
  "it": {
    "error": "Errore",
    "signup": "Crea un account",
    "description": "Inserisci le tue informazioni qui sotto per creare il tuo account",
    "name": "Nome completo",
    "email": "Email",
    "password": "Password",
    "confirm_password": "Conferma Password",
    "create_account": "Crea Account",
    "creating_account": "Creazione account...",
    "have_account": "Hai già un account?",
    "log_in": "Accedi",
    "name_placeholder": "Mario Rossi",
    "password_placeholder": "Inserisci qui la tua password",
    "password_description": "Deve contenere almeno 8 caratteri.",
    "password_confirm_placeholder": "Reinserisci la tua password",
    "confirm_password_description": "Per favore conferma la tua password.",
    "email_description": "Non condivideremo mai la tua email con nessun altro.",
    "signup_fill_all_fields": "Per favore, compila tutti i campi.",
    "signup_passwords_do_not_match": "Le password non corrispondono.",
    "signup_passwords_requirements": "La password deve contenere almeno 8 caratteri e includere lettere maiuscole, lettere minuscole e numeri."
  },
  "es": {
    "error": "Error",
    "signup": "Crea una cuenta",
    "description": "Introduce tu información a continuación para crear tu cuenta",
    "name": "Nombre completo",
    "email": "Correo electrónico",
    "password": "Contraseña",
    "confirm_password": "Confirmar contraseña",
    "create_account": "Crear cuenta",
    "creating_account": "Creando cuenta...",
    "have_account": "¿Ya tienes una cuenta?",
    "log_in": "Iniciar sesión",
    "name_placeholder": "Juan Pérez",
    "password_placeholder": "Introduce aquí tu contraseña",
    "password_description": "Debe tener al menos 8 caracteres.",
    "password_confirm_placeholder": "Vuelve a introducir tu contraseña",
    "confirm_password_description": "Por favor confirma tu contraseña.",
    "email_description": "Nunca compartiremos tu correo electrónico con nadie más.",
    "signup_fill_all_fields": "Por favor, completa todos los campos.",
    "signup_passwords_do_not_match": "Las contraseñas no coinciden.",
    "signup_passwords_requirements": "La contraseña debe tener al menos 8 caracteres e incluir letras mayúsculas, letras minúsculas y números."
  }
}
</i18n>
