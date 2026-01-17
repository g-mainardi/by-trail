<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

// --- UI Components ---
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-vue-next';
import ProfilePersonalData from './info/ProfilePersonalData.vue';
import ProfileRegionSelector from './info/ProfileRegionSelector.vue';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-vue-next';
import type { Region } from '@/types';

const authStore = useAuthStore();
const { user, isLoading } = storeToRefs(authStore);

const { t } = useI18n();

// --- Form Local State ---
const formData = ref({
  name: '',
  email: '',
  favRegions: [] as Region[],
});

const feedbackMessage = ref('');
const isError = ref(false);

// --- Init Data ---
onMounted(async () => {
  // Ensure we have the latest profile
  await authStore.fetchProfile();

  // Populate formData
  if (user.value) {
    formData.value.name = user.value.name;
    formData.value.email = user.value.email;
    // Create a copy of the array to avoid direct mutation of store state
    formData.value.favRegions = user.value.favRegions
      ? [...(user.value.favRegions as Region[])]
      : [];
  }
});

// --- Handle Save ---
const handleSave = async () => {
  feedbackMessage.value = '';
  isError.value = false;

  // Prepare payload
  const payload = {
    name: formData.value.name,
    favRegions: formData.value.favRegions,
  };

  // Call store action to update profile
  const success = await authStore.updateProfile(payload);
  if (success) {
    feedbackMessage.value = t('profile_update_success');
  } else {
    isError.value = true;
    feedbackMessage.value = t('profile_update_error');
  }
};

const alertConfig = computed(() => {
  if (isError.value) {
    return {
      variant: 'destructive' as const,
      icon: AlertCircle,
    };
  }
  return {
    variant: 'success' as const,
    icon: CheckCircle,
  };
});
</script>

<template>
  <div class="mb-6">
    <Alert v-if="feedbackMessage" :variant="alertConfig.variant" class="mb-6">
      <component :is="alertConfig.icon" />
      <AlertTitle>{{ feedbackMessage }}</AlertTitle>
    </Alert>
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
    "profile_update_success": "Profile updated successfully.",
    "profile_update_error": "An error occurred while updating your profile.",
    "saving": "Saving...",
    "save_modifications": "Save Changes"
  },
  "it": {
    "profile_update_success": "Profilo aggiornato con successo.",
    "profile_update_error": "Si è verificato un errore durante l'aggiornamento del profilo.",
    "saving": "Salvataggio...",
    "save_modifications": "Salva Modifiche"
  },
  "es": {
    "profile_update_success": "Perfil actualizado con éxito.",
    "profile_update_error": "Ocurrió un error al actualizar tu perfil.",
    "saving": "Guardando...",
    "save_modifications": "Guardar Modificaciones"
  }
}
</i18n>
