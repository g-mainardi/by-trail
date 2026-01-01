<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

// --- UI Components ---
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import ProfilePersonalData from './info/ProfilePersonalData.vue';
import ProfileRegionSelector from './info/ProfileRegionSelector.vue';

const authStore = useAuthStore();
const { user, isLoading } = storeToRefs(authStore);

const { t } = useI18n();

// --- Form Local State ---
const formData = ref({
  name: '',
  email: '',
  favRegions: [] as string[],
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
    // Create a copy of the array to avoid direct mutation of store state
    formData.value.favRegions = user.value.favRegions
      ? [...user.value.favRegions]
      : [];
  }
});

// --- Handle Save ---
const handleSave = async () => {
  feedbackMessage.value = '';
  isError.value = false;

  // 1. Prepare payload
  const payload = {
    name: formData.value.name,
    favRegions: formData.value.favRegions,
  };

  // 2. Call store action to update profile
  const success = await authStore.updateProfile(payload);
  if (success) {
    feedbackMessage.value = t('profile_update_success');
    //todo applyTheme(payload.darkMode);
  } else {
    isError.value = true;
    feedbackMessage.value = t('profile_update_error');
  }
};
</script>

<template>
  <div class="flex flex-col w-full gap-8 p-6 md:p-10">
    <div
      class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          {{ t('your_profile') }}
        </h1>
        <p class="text-muted-foreground">{{ t('handle_info_preferences') }}</p>
      </div>
      <div
        v-if="feedbackMessage"
        :class="
          cn(
            'px-4 py-2 text-sm rounded-md font-medium border animate-in fade-in slide-in-from-top-2',
            isError
              ? 'bg-red-50 text-red-600 border-red-200'
              : 'bg-green-50 text-green-600 border-green-200'
          )
        "
      >
        {{ feedbackMessage }}
      </div>
    </div>

    <form
      @submit.prevent="handleSave"
      class="grid grid-cols-1 gap-6 lg:grid-cols-12"
    >
      <div class="space-y-6 lg:col-span-5">
        <ProfilePersonalData
          v-model="formData.name"
          :email="formData.email"
          :readOnlyFullName="user?.name || ''"
        />
      </div>

      <div class="space-y-6 lg:col-span-7">
        <ProfileRegionSelector v-model="formData.favRegions" />
        <Button
          @click="handleSave"
          :disabled="isLoading"
          size="lg"
          class="w-full sm:w-auto"
        >
          <Save class="w-4 h-4 mr-2" />
          <span v-if="isLoading">{{ t('saving') }}</span>
          <span v-else>{{ t('save_modifications') }}</span>
        </Button>
      </div>
    </form>
  </div>
</template>
<i18n>
{
  "en": {
    "your_profile": "Your Profile",
    "handle_info_preferences": "Manage your information and preferences",
    "profile_update_success": "Profile updated successfully.",
    "profile_update_error": "An error occurred while updating your profile.",
    "saving": "Saving...",
    "save_modifications": "Save Changes",
  },
  "it": {
    "your_profile": "Il Tuo Profilo",
    "handle_info_preferences": "Gestisci le tue informazioni e preferenze",
    "profile_update_success": "Profilo aggiornato con successo.",
    "profile_update_error": "Si è verificato un errore durante l'aggiornamento del profilo.",
    "saving": "Salvataggio...",
    "save_modifications": "Salva Modifiche",
  },
  "es": {
    "your_profile": "Tu Perfil",
    "handle_info_preferences": "Gestiona tu información y preferencias",
    "profile_update_success": "Perfil actualizado con éxito.",
    "profile_update_error": "Ocurrió un error al actualizar tu perfil.",
    "saving": "Guardando...",
    "save_modifications": "Guardar Modificaciones",
  }
}
</i18n>
