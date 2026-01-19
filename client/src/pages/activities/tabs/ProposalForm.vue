<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useProposalStore } from '@/stores/proposal';
import {
  ProposalEnum,
  RegionsEnum,
  type Proposal,
  type ProposalType,
  type Region,
} from '@/types';
import { storeToRefs } from 'pinia';

// --- UI Components ---
import { Button } from '@/components/ui/button';
import { SendIcon } from 'lucide-vue-next';
import Input from '@/components/ui/input/Input.vue';
import TextArea from '@/components/ui/textarea/Textarea.vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-vue-next';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const proposalStore = useProposalStore();
const authStore = useAuthStore();
const { error, isLoading } = storeToRefs(authStore);
const { proposalError, isSubmitting } = storeToRefs(proposalStore);

const { t } = useI18n();

// --- Form Local State ---
const proposalType = ref<ProposalType | null>();
const region = ref<Region | null>();
const locality = ref('');
const subjectName = ref('');
const description = ref('');

const feedbackMessage = ref('');
const isError = ref(false);

onMounted(async () => {
  await authStore.fetchProfile();
});

// --- Handle Proposal Submission ---
const submitProposal = async () => {
  feedbackMessage.value = '';
  isError.value = false;

  // Prevent empty submission
  locality.value = locality.value.trim();
  subjectName.value = subjectName.value.trim();
  description.value = description.value.trim();
  if (
    !proposalType.value ||
    !region.value ||
    !locality.value ||
    !subjectName.value ||
    !description.value
  ) {
    isError.value = true;
    feedbackMessage.value = t('proposal_submit_incomplete');
    return;
  }

  // Prepare payload
  const payload: Proposal = {
    type: proposalType.value,
    region: region.value,
    locality: locality.value.trim(),
    subjectName: subjectName.value.trim(),
    description: description.value.trim(),
  };

  const success = await proposalStore.sendProposal(payload);
  if (success) {
    feedbackMessage.value = t('proposal_submit_success');
    // Clear form
    proposalType.value = null;
    region.value = null;
    locality.value = '';
    subjectName.value = '';
    description.value = '';
  } else {
    isError.value = true;
    feedbackMessage.value = `${t('proposal_submit_error')} "${getErrorMessage.value}"`;
  }
};

const alertConfig = computed(() => {
  if (isError.value || getErrorMessage.value) {
    return {
      variant: 'destructive' as const,
      icon: AlertCircle,
      title: t('error'),
    };
  }
  return {
    variant: 'success' as const,
    icon: CheckCircle,
    title: t('success'),
  };
});

const getErrorMessage = computed(() => {
  return proposalError.value || error.value || '';
});
</script>

<template>
  <Alert v-if="feedbackMessage" :variant="alertConfig.variant">
    <component :is="alertConfig.icon" />
    <AlertTitle>{{ alertConfig.title }}</AlertTitle>
    <AlertDescription>
      {{ feedbackMessage }}
    </AlertDescription>
  </Alert>
  <form @submit.prevent="submitProposal">
    <FieldGroup class="w-half">
      <Field>
        <FieldLabel for="type">
          {{ t('proposal_type_label') }}
        </FieldLabel>
        <Select id="type" v-model="proposalType" class="w-full" required>
          <SelectTrigger>
            <SelectValue :placeholder="t('proposal_type_placeholder')" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="route">{{
                t('proposal_type_route')
              }}</SelectItem>
              <SelectItem value="bivouac">{{
                t('proposal_type_bivouac')
              }}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <FieldGroup v-if="proposalType">
        <Field>
          <FieldLabel for="name">{{ t('name') }} </FieldLabel>
          <Input
            id="name"
            v-model="subjectName"
            class="h-10"
            required
            :placeholder="
              proposalType === ProposalEnum.ROUTE
                ? t('route_name')
                : proposalType === ProposalEnum.BIVOUAC
                  ? t('bivouac_name')
                  : ''
            "
          />
        </Field>
        <Field>
          <FieldLabel for="description">{{ t('description') }}</FieldLabel>
          <TextArea
            id="description"
            v-model="description"
            rows="5"
            class="resize-vertical"
            required
            :placeholder="t('description_placeholder')"
          />
        </Field>

        <Field>
          <FieldLabel for="region">{{ t('region') }}</FieldLabel>
          <Select id="region" v-model="region" required>
            <SelectTrigger>
              <SelectValue :placeholder="t('region_placeholder')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="region in Object.values(RegionsEnum)"
                :key="region"
                :value="region"
              >
                {{ region }}
              </SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel for="locality">{{ t('locality') }}</FieldLabel>
          <Input
            id="locality"
            v-model="locality"
            class="h-10"
            required
            :placeholder="t('locality_placeholder')"
          />
        </Field>

        <Button
          type="submit"
          :disabled="isSubmitting || isLoading"
          size="lg"
          class="w-auto sm:w-auto"
        >
          <SendIcon class="w-4 h-4 mr-2" />
          <span v-if="isSubmitting || isLoading">{{ t('sending') }}</span>
          <span v-else>{{ t('send') }}</span>
        </Button>
      </FieldGroup>
    </FieldGroup>
  </form>
</template>

<i18n>
{
  "en": {
    "proposal_type_label": "Proposal Type",
    "proposal_type_placeholder": "Select proposal type",
    "proposal_type_route": "Route",
    "proposal_type_bivouac": "Bivouac",
    "proposal_submit_success": "Your proposal has been submitted successfully.",
    "error": "Error",
    "success": "Success",
    "proposal_submit_incomplete": "Please fill in all required fields before submitting the proposal.",
    "proposal_submit_error": "There was an error submitting your proposal:",
    "name": "Name",
    "route_name": "Route Name",
    "bivouac_name": "Bivouac Name",
    "description": "Description",
    "description_placeholder": "Provide a detailed description here...",
    "region": "Region",
    "region_placeholder": "Select Region",
    "locality": "Locality",
    "locality_placeholder": "Enter the locality here...",
    "sending": "Sending...",
    "send": "Send"
  },
  "it": {
    "proposal_type_label": "Tipo di Proposta",
    "proposal_type_placeholder": "Seleziona il tipo di proposta",
    "proposal_type_route": "Percorso",
    "proposal_type_bivouac": "Bivacco",
    "proposal_submit_success": "La tua proposta è stata inviata con successo.",
    "error": "Errore",
    "success": "Successo",
    "proposal_submit_incomplete": "Per favore, compila tutti i campi richiesti prima di inviare la proposta.",
    "proposal_submit_error": "Si è verificato un errore durante l'invio della tua proposta:",
    "name": "Nome",
    "route_name": "Nome del Percorso",
    "bivouac_name": "Nome del Bivacco",
    "description": "Descrizione",
    "description_placeholder": "Fornisci una descrizione dettagliata qui...",
    "region": "Regione",
    "region_placeholder": "Seleziona Regione",
    "locality": "Località",
    "locality_placeholder": "Inserisci la località qui...",
    "sending": "Invio in corso...",
    "send": "Invia"
  },
  "es": {
    "proposal_type_label": "Tipo de Propuesta",
    "proposal_type_placeholder": "Selecciona el tipo de propuesta",
    "proposal_type_route": "Ruta",
    "proposal_type_bivouac": "Bivouac",
    "proposal_submit_success": "Tu propuesta ha sido enviada con éxito.",
    "error": "Error",
    "success": "Éxito",
    "proposal_submit_incomplete": "Por favor, completa todos los campos requeridos antes de enviar la propuesta.",
    "proposal_submit_error": "Hubo un error al enviar tu propuesta:",
    "name": "Nombre",
    "route_name": "Nombre de la Ruta",
    "bivouac_name": "Nombre del Bivouac",
    "description": "Descripción",
    "description_placeholder": "Proporciona una descripción detallada aquí...",
    "region": "Región",
    "region_placeholder": "Seleccionar Región",
    "locality": "Localidad",
    "locality_placeholder": "Introduce la localidad aquí...",
    "sending": "Enviando...",
    "send": "Enviar"
  }
}
</i18n>
