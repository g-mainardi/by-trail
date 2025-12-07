<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
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
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Reactive state for form inputs
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const validationError = ref<string | null>(null) // Local error (e.g. passwords do not match)

const handleSignup = async () => {
  // Resets previous validation error
  validationError.value = null
  
  // Prevent empty submission
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    validationError.value = "Please fill in all fields."
    return
  }

  // Check password
  if (password.value !== confirmPassword.value) {
    validationError.value = "Passwords do not match."
    return
  }
  if (password.value.length < 8) {
    validationError.value = "Password must be at least 8 characters long."
    return
  }

  // Call backend through Pinia store
  const success = await authStore.signup(name.value, email.value, password.value)

  // Redirect to login on success
  if (success) {
    router.push('/login')
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Create an account</CardTitle>
      <CardDescription>
        Enter your information below to create your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSignup">
        
        <Alert v-if="validationError || authStore.error" variant="destructive" class="mb-6">
          <AlertCircle class="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {{ validationError || authStore.error }}
          </AlertDescription>
        </Alert>

        <FieldGroup>
          <Field>
            <FieldLabel for="name">
              Full Name
            </FieldLabel>
            <Input 
              id="name" 
              v-model="name"
              type="text" 
              placeholder="John Doe" 
              required 
            />
          </Field>
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
            <FieldDescription>
              We'll use this to contact you. We will not share your email with
              anyone else.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel for="password">
              Password
            </FieldLabel>
            <Input 
              id="password" 
              v-model="password"
              type="password" 
              required 
            />
            <FieldDescription>Must be at least 8 characters long.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel for="confirm-password">
              Confirm Password
            </FieldLabel>
            <Input 
              id="confirm-password" 
              v-model="confirmPassword"
              type="password" 
              required 
            />
            <FieldDescription>Please confirm your password.</FieldDescription>
          </Field>
          <FieldGroup>
            <Field>
              <Button type="submit" :disabled="authStore.isLoading">
                {{ authStore.isLoading ? 'Creating account...' : 'Create Account' }}
              </Button>
              <FieldDescription class="px-6 text-center">
                Already have an account? <RouterLink to="/login">Log in</RouterLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>