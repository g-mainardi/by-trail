<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
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
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert'
import { AlertCircle } from 'lucide-vue-next' // Import Error Icon
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from "vue"
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
const { t } = useI18n()

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const authStore = useAuthStore()

// Reactive state for form inputs
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  // Prevent empty submission
  if (!email.value || !password.value) return
  
  // Call the login action from Pinia store
  await authStore.login(email.value, password.value)
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle> {{ t("login") }} </CardTitle>
        <CardDescription>
          {{ t("description") }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin">
          
          <FieldGroup>
            <Alert v-if="authStore.error" variant="destructive" class="mb-4">
              <AlertCircle class="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {{ authStore.error }}
              </AlertDescription>
            </Alert>

            <Field>
              <FieldLabel for="email">
                {{ t("email") }}
              </FieldLabel>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Field>
              <div class="flex items-center">
                <FieldLabel for="password">
                  {{ t("password") }}
                </FieldLabel>
                <a
                  href="#"
                  class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  {{ t("forgot_password") }}
                </a>
              </div>
              <Input 
                id="password" 
                v-model="password" 
                type="password" 
                required 
              />
            </Field>
            <Field>
              <Button type="submit" :disabled="authStore.isLoading">
                {{ authStore.isLoading ? 'Signing in...' : t("login_button") }}
              </Button>
              <Button variant="outline" type="button">
                {{ t("login_google") }}
              </Button>
              <FieldDescription class="text-center">
                {{ t("no_account") }}
                <RouterLink to="/signup">
                  {{ t("sign_up") }}
                </RouterLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<i18n>
{
  "en": {
    "login": "Login to your account",
    "description": "Enter your email below to login to your account",
    "email": "Email",
    "password": "Password",
    "forgot_password": "Forgot your password?",
    "login_button": "Login",
    "login_google": "Login with Google",
    "no_account": "Don't have an account?",
    "sign_up": "Sign up"
  },
  "it": {
    "login": "Accedi al tuo account",
    "description": "Inserisci la tua email qui sotto per accedere al tuo account",
    "email": "Email",
    "password": "Password",
    "forgot_password": "Hai dimenticato la password?",
    "login_button": "Accedi",
    "login_google": "Accedi con Google",
    "no_account": "Non hai un account?",
    "sign_up": "Registrati"
  },
  "es": {
    "login": "Inicia sesión en tu cuenta",
    "description": "Ingresa tu correo electrónico a continuación para iniciar sesión en tu cuenta",
    "email": "Correo electrónico",
    "password": "Contraseña",
    "forgot_password": "¿Olvidaste tu contraseña?",
    "login_button": "Iniciar sesión",
    "login_google": "Iniciar sesión con Google",
    "no_account": "¿No tienes una cuenta?",
    "sign_up": "Regístrate"
  }
}
</i18n>