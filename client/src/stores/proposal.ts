import { HttpHelper } from '@/stores/utility/httpHelper';
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
  const { user, token } = storeToRefs(authStore);
  const isSubmitting = ref(false);
  const proposalError = ref<string | null>(null);

  const httpHelper = new HttpHelper('/api', token.value || undefined);

  // --- State ---
  const email = computed(() => user.value?.email || '');

  const sendProposal = async (proposalData: Proposal) => {
    isSubmitting.value = true;
    proposalError.value = null;

    try {
      const res = await httpHelper.post('/proposal', proposalData);
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || 'Proposal submission failed');
      return true;
    } catch (err: any) {
      proposalError.value = err.message;
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  return { sendProposal, proposalError, isSubmitting, email };
});
