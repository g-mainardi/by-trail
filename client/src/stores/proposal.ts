import api from '@/stores/utility/axiosInstance';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const ProposalEnum = {
  ROUTE: 'route',
  BIVOUAC: 'bivouac',
} as const;

type ProposalType = (typeof ProposalEnum)[keyof typeof ProposalEnum];

export interface Proposal {
  senderEmail: string;
  type: ProposalType;
  subjectName: string;
  description: string;
  locality: string;
}

export const useProposalStore = defineStore('proposal', () => {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
  const isSubmitting = ref(false);
  const proposalError = ref<string | null>(null);

  // --- State ---
  const email = computed(() => user.value?.email || '');

  const sendProposal = async (proposalData: Proposal) => {
    isSubmitting.value = true;
    proposalError.value = null;

    try {
      await api.post('/proposal', proposalData);
      // If we are here, status is 2xx
      return true;
    } catch (err: any) {
      proposalError.value = err.response?.data?.message || err.message;
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  return { sendProposal, proposalError, isSubmitting, email };
});
