<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

// --- UI Components ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const authStore = useAuthStore();
const { user, isLoading } = storeToRefs(authStore);

const { t } = useI18n();

// --- Form Local State ---
const formData = ref({
  name: '',
  email: '', // Read-only
  favRegions: '', // Comma-separated string
  language: 'en',
  darkMode: false,
});

const feedbackMessage = ref('');
const isError = ref(false);

// --- Init Data ---
onMounted(async () => {
  // 1. Ensure we have the latest profile
  await authStore.fetchProfile();

  // 2. Populate formData
  if (user.value) {
    formData.value.name = user.value.name;
    formData.value.email = user.value.email;
    formData.value.favRegions = (user.value.favRegions ?? []).join(', '); // Array -> String conversion 
  }
});

// --- Handle Save ---
const handleSave = async () => {
  feedbackMessage.value = '';
  isError.value = false;

  // 1. String -> Array conversion
  const regionsArray = formData.value.favRegions
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // 2. Prepare payload
  const payload = {
    name: formData.value.name,
    favRegions: regionsArray,
    language: formData.value.language,
    darkMode: formData.value.darkMode
  };

  // 3. Call store action to update profile
  const success = await authStore.updateProfile(payload);

  if (success) {
    feedbackMessage.value = t("profile_update_success");
    // applyTheme(payload.darkMode); 
  } else {
    isError.value = true;
    feedbackMessage.value = t("profile_update_error");
  }
};
</script>

<template>
  <div class="container max-w-2xl py-10 mx-auto">
    
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold tracking-tight">{{t("your_profile")}}</h1>
      <p class="text-muted-foreground">{{ t("handle_info_preferences") }}</p>
    </div>

    <Card>
      <CardHeader class="flex flex-row items-center gap-4">
        <Avatar class="w-16 h-16 border-2 cursor-pointer border-primary">
          <AvatarFallback>{{ user?.name?.charAt(0).toUpperCase() }}</AvatarFallback>
        </Avatar>
        
        <div>
          <CardTitle>{{ user?.name }}</CardTitle>
          <CardDescription>{{ user?.email }}</CardDescription>
        </div>
      </CardHeader>

      <CardContent class="space-y-6">
        
        <div v-if="feedbackMessage" 
             :class="`p-3 text-sm rounded-md ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`">
          {{ feedbackMessage }}
        </div>

        <form @submit.prevent="handleSave" class="space-y-4">
          
          <div class="space-y-2">
            <Label for="name">{{ t("complete_name") }}</Label>
            <Input id="name" v-model="formData.name" :placeholder="t('your_name')" />
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="formData.email" disabled class="bg-muted" />
            <p class="text-[0.8rem] text-muted-foreground">{{t("unmodifiable_email")}}</p>
          </div>

          <div class="space-y-2">
            <Label for="regions">{{t("preferred_regions")}}</Label>
            <Input id="regions" v-model="formData.favRegions" :placeholder="t('regions_examples')" />
          </div>

        </form>
      </CardContent>

      <CardFooter class="flex justify-end border-t pt-6">
        <Button @click="handleSave" :disabled="isLoading">
          <span v-if="isLoading">{{t("saving")}}</span>
          <span v-else>{{t("save_modifications")}}</span>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
<i18n>
{
  "en": {
    "complete_name": "Complete Name",
    "your_profile": "Your Profile",
    "handle_info_preferences": "Manage your information and preferences",
    "your_name": "Your full name",
    "unmodifiable_email": "Your email cannot be modified.",
    "preferred_regions": "Preferred Regions",
    "regions_examples": "e.g., Alps, Dolomites, Apennines",
    "profile_update_success": "Profile updated successfully.",
    "profile_update_error": "An error occurred while updating your profile.",
    "saving": "Saving...",
    "save_modifications": "Save Modifications",
  },
  "it": {
    "complete_name": "Nome Completo",
    "your_profile": "Il Tuo Profilo",
    "handle_info_preferences": "Gestisci le tue informazioni e preferenze",
    "your_name": "Il tuo nome completo",
    "unmodifiable_email": "La tua email non può essere modificata.",
    "preferred_regions": "Regioni Preferite",
    "regions_examples": "es., Alpi, Dolomiti, Appennini",
    "profile_update_success": "Profilo aggiornato con successo.",
    "profile_update_error": "Si è verificato un errore durante l'aggiornamento del profilo.",
    "saving": "Salvataggio...",
    "save_modifications": "Salva Modifiche",
  },
  "es": {
    "complete_name": "Nombre Completo",
    "your_profile": "Tu Perfil",
    "handle_info_preferences": "Gestiona tu información y preferencias",
    "your_name": "Tu nombre completo",
    "unmodifiable_email": "Tu correo electrónico no se puede modificar.",
    "preferred_regions": "Regiones Preferidas",
    "regions_examples": "ej., Alpes, Dolomitas, Apeninos",
    "profile_update_success": "Perfil actualizado con éxito.",
    "profile_update_error": "Ocurrió un error al actualizar tu perfil.",
    "saving": "Guardando...",
    "save_modifications": "Guardar Modificaciones",
  }
}
</i18n>