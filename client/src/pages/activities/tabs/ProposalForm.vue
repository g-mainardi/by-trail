<script setup lang="ts">
import H1 from '@/layouts/typography/H1.vue';
import { useI18n } from 'vue-i18n';
import { ref, onMounted } from 'vue';
import { useProposalStore } from '@/stores/proposal';
import { storeToRefs } from 'pinia';

const proposalStore = useProposalStore();
const { isLoading, email } = storeToRefs(proposalStore);

const { t } = useI18n();

// --- Form Local State ---
const formData = ref({
  email: '',
  type: '',
  name: '',
  description: '',
  locality: '',
});

const feedbackMessage = ref('');
const isError = ref(false);

onMounted(async () => {
  await proposalStore.fetchEmail();
  formData.value.email = email.value || '';
});

// --- Handle Proposal Submission ---
const submitProposal = async () => {
  feedbackMessage.value = '';
  isError.value = false;

  // Prevent empty submission
  if (
    !formData.value.type ||
    !formData.value.name ||
    !formData.value.description ||
    !formData.value.locality
  ) {
    isError.value = true;
    feedbackMessage.value = t('proposal_submit_incomplete');
    return;
  }

  // Prepare payload
  const payload = {
    email: formData.value.email,
    type: formData.value.type,
    name: formData.value.name,
    description: formData.value.description,
    locality: formData.value.locality,
  };

  // Call store action to update profile
  const success = await proposalStore.sendProposal(payload);
  if (success) {
    feedbackMessage.value = t('proposal_submit_success');
  } else {
    isError.value = true;
    feedbackMessage.value = t('proposal_submit_error');
  }
};
</script>

<template>
  <H1 :text="t('make_a_proposal')" />
</template>

<i18n>
{
  "en": {
    "make_a_proposal": "Make a Proposal"
  },
  "it": {
    "make_a_proposal": "Fai una Proposta"
  },
  "es": {
    "make_a_proposal": "Haz una Propuesta"
  }
}
</i18n>
