import { HttpHelper } from '@/stores/utility/httpHelper';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { defineStore } from 'pinia';
import { ref } from 'vue';

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
}

export const useProposalStore = defineStore('proposal', () => {
  const authStore = useAuthStore();
  const { user, isLoading, error, token } = storeToRefs(authStore);
  const httpHelper = new HttpHelper('/api', token.value || undefined);

  // --- State ---
  const email = ref<string>('');

  const sendProposal = async (proposalData: Proposal) => {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await httpHelper.post('/proposal', proposalData);
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || 'Proposal submission failed');
      return true;
    } catch (err: any) {
      console.error(err);
      error.value = err.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchEmail = async () => {
    await authStore.fetchProfile();
    if (user.value && user.value.email) {
      email.value = user.value.email;
      return true;
    } else {
      error.value = 'User email not found';
      return false;
    }
  };

  return { sendProposal, fetchEmail, error, isLoading, email };
});
