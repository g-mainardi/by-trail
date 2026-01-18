import type { Intention } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from './utility/axiosInstance';

interface IntentionResponse {
  success: boolean;
  error?: string;
  message?: string;
}

interface AnonymousIntention {
  date: Date;
  people: number;
}

export const useIntentionStore = defineStore('intentions', () => {
  // State

  const userIntentions = ref<Intention[]>([]);

  // Action

  const fetchUserIntentions = async () => {
    try {
      const res = await api.get(`/users/intentions`);

      const data = res.data;
      if (!data || !data.intentions || !Array.isArray(data.intentions))
        throw new Error('Invalid data structure received');

      userIntentions.value = data.intentions as Intention[];
    } catch (error: any) {
      console.error('Error fetching intentions:', error);
      return [];
    }
  };

  const sendIntention = async (
    bivouacId: string,
    date: Date,
    people: number
  ): Promise<IntentionResponse> => {
    try {
      const body = {
        bivouacId: bivouacId,
        date: date,
        people: people,
      };
      const res = await api.post(`/users/intention`, body);
      if (res.status === 200 || res.status === 201)
        return { success: true, message: res.data.message };
      return {
        success: false,
        error: `Unexpected response status: ${res.status}`,
      };
    } catch (error: any) {
      console.error('Error sending intention:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteIntention = async (
    intentionId: string
  ): Promise<IntentionResponse> => {
    try {
      const body = {
        intentionId: intentionId,
      };
      const res = await api.delete(`/users/intention`, { data: body });
      if (res.status === 200)
        return { success: true, message: res.data.message };
      return {
        success: false,
        error: `Unexpected response status: ${res.status}`,
      };
    } catch (error: any) {
      console.error('Error deleting intention:', error);
      return { success: false, error: error.message };
    }
  };

  const fetchAnonymousBivouacIntentions = async (
    bivouacId: string
  ): Promise<AnonymousIntention[]> => {
    try {
      const res = await api.get(`/bivouacs/intentions`, {
        params: { bivouacId },
      });

      const data = res.data;
      if (!data || !data.intentions || !Array.isArray(data.intentions))
        throw new Error('Invalid data structure received');

      return data.intentions as AnonymousIntention[];
    } catch (error: any) {
      console.error('Error fetching bivouac intentions:', error);
      return [];
    }
  };

  return {
    sendIntention,
    deleteIntention,
    fetchUserIntentions,
    fetchAnonymousBivouacIntentions,
    userIntentions,
  };
});
