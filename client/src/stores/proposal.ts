import api from '@/stores/utility/axiosInstance';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Proposal } from '@/types';

export const useProposalStore = defineStore('proposal', () => {
  const isSubmitting = ref(false);
  const proposalError = ref<string | null>(null);

  // --- State ---
  const sendProposal = async (proposalData: Proposal) => {
    isSubmitting.value = true;
    proposalError.value = null;

    try {
      await api.post('/proposals', proposalData);
      // If we are here, status is 2xx
      return true;
    } catch (err: any) {
      proposalError.value = err.response?.data?.message || err.message;
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  return { sendProposal, proposalError, isSubmitting };
});
