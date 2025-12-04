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
import { RouterLink } from 'vue-router'

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
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
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
                Email
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
                  Password
                </FieldLabel>
                <a
                  href="#"
                  class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
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
                {{ authStore.isLoading ? 'Signing in...' : 'Login' }}
              </Button>
              <Button variant="outline" type="button">
                Login with Google
              </Button>
              <FieldDescription class="text-center">
                Don't have an account?
                <RouterLink to="/signup">
                  Sign up
                </RouterLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
