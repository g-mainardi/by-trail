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
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, X } from 'lucide-vue-next'; // Icons
import { cn } from '@/lib/utils';

// --- Shadcn Command & Popover ---
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const authStore = useAuthStore();
const { user, isLoading } = storeToRefs(authStore);

const { t } = useI18n();

// --- Constants ---
const ITALIAN_REGIONS = [
  "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna",
  "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche",
  "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana",
  "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto"
];

// --- Form Local State ---
const formData = ref({
  name: '',
  email: '',
  favRegions: [] as string[]
});

const feedbackMessage = ref('');
const isError = ref(false);
const openRegions = ref(false); // Popover state  

// --- Init Data ---
onMounted(async () => {
  // 1. Ensure we have the latest profile
  await authStore.fetchProfile();

  // 2. Populate formData
  if (user.value) {
    formData.value.name = user.value.name;
    formData.value.email = user.value.email;
    // Create a copy of the array to avoid direct mutation of store state
    formData.value.favRegions = user.value.favRegions ? [...user.value.favRegions] : []; 
  }
});

// --- Logic: Toggle Region (Add/Remove from Popover) ---
const toggleRegion = (region: string) => {
  const current = formData.value.favRegions;
  if (current.includes(region)) {
    // Remove
    formData.value.favRegions = current.filter((r) => r !== region);
  } else {
    // Add
    formData.value.favRegions.push(region);
  }
};

// --- Logic: Remove Tag (Remove from Badge) ---
const removeRegion = (region: string) => {
  formData.value.favRegions = formData.value.favRegions.filter((r) => r !== region);
};

// --- Handle Save ---
const handleSave = async () => {
  feedbackMessage.value = '';
  isError.value = false;

  // 1. Prepare payload
  const payload = {
    name: formData.value.name,
    favRegions: formData.value.favRegions
  };

  // 2. Call store action to update profile
  const success = await authStore.updateProfile(payload);
  if (success) {
    feedbackMessage.value = t("profile_update_success");
    //todo applyTheme(payload.darkMode); 
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
             :class="cn('p-3 text-sm rounded-md', isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600')">
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

          <div class="space-y-3">
            <Label>{{ t("preferred_regions") }}</Label>
            
            <Popover v-model:open="openRegions">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  role="combobox"
                  :aria-expanded="openRegions"
                  class="justify-between w-full"
                >
                  <span class="text-muted-foreground" v-if="formData.favRegions.length === 0">
                    {{ t("select_regions") }}
                  </span>
                  <span class="text-foreground" v-else>
                     {{ formData.favRegions.length }} {{ t("selected_regions") }}
                  </span>
                  <ChevronsUpDown class="w-4 h-4 ml-2 opacity-50 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-full p-0">
                <Command>
                  <CommandInput :placeholder="t('search_region')" />
                  <CommandEmpty>{{t("no_region_found")}}</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem
                        v-for="region in ITALIAN_REGIONS"
                        :key="region"
                        :value="region"
                        @select="() => toggleRegion(region)"
                      >
                        <Check
                          :class="cn(
                            'mr-2 h-4 w-4',
                            formData.favRegions.includes(region) ? 'opacity-100' : 'opacity-0'
                          )"
                        />
                        {{ region }}
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div class="flex flex-wrap gap-2 mt-2">
              <Badge 
                v-for="region in formData.favRegions" 
                :key="region" 
                variant="secondary"
                class="flex items-center gap-1 px-3 py-1"
              >
                {{ region }}
                <button 
                  type="button"
                  class="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  @click.prevent.stop="removeRegion(region)"
                >
                  <X class="w-3 h-3 cursor-pointer hover:text-red-500" />
                </button>
              </Badge>
            </div>
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
    "select_regions": "Select regions...",
    "selected_regions": "regions selected",
    "profile_update_success": "Profile updated successfully.",
    "profile_update_error": "An error occurred while updating your profile.",
    "saving": "Saving...",
    "save_modifications": "Save Modifications",
    "search_region": "Search region...",
    "no_region_found": "No region found."
  },
  "it": {
    "complete_name": "Nome Completo",
    "your_profile": "Il Tuo Profilo",
    "handle_info_preferences": "Gestisci le tue informazioni e preferenze",
    "your_name": "Il tuo nome completo",
    "unmodifiable_email": "La tua email non può essere modificata.",
    "preferred_regions": "Regioni Preferite",
    "select_regions": "Seleziona regioni...",
    "selected_regions": "regioni selezionate",
    "profile_update_success": "Profilo aggiornato con successo.",
    "profile_update_error": "Si è verificato un errore durante l'aggiornamento del profilo.",
    "saving": "Salvataggio...",
    "save_modifications": "Salva Modifiche",
    "search_region": "Cerca regione...",
    "no_region_found": "Nessuna regione trovata."
  },
  "es": {
    "complete_name": "Nombre Completo",
    "your_profile": "Tu Perfil",
    "handle_info_preferences": "Gestiona tu información y preferencias",
    "your_name": "Tu nombre completo",
    "unmodifiable_email": "Tu correo electrónico no se puede modificar.",
    "preferred_regions": "Regiones Preferidas",
    "select_regions": "Seleccionar regiones...",
    "selected_regions": "regiones seleccionadas",
    "profile_update_success": "Perfil actualizado con éxito.",
    "profile_update_error": "Ocurrió un error al actualizar tu perfil.",
    "saving": "Guardando...",
    "save_modifications": "Guardar Modificaciones",
    "search_region": "Buscar región...",
    "no_region_found": "No se encontró ninguna región."
  }
}
</i18n>