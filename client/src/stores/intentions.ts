import { defineStore } from 'pinia';
import type { DateValue } from 'reka-ui';
import api from './utility/axiosInstance';

interface Intention {
  bivouacId: string;
  date: DateValue;
  people: number;
}

export const useIntentionStore = defineStore('intentions', () => {
  async function sendIntention(
    bivouacId: string,
    date: Date,
    people: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const body = {
        bivouacId: bivouacId,
        date: date,
        people: people,
      };
      const res = await api.post(`/users/intention`, body);
      if (res.status === 200 || res.status === 201) return { success: true };
      return {
        success: false,
        error: `Unexpected response status: ${res.status}`,
      };
    } catch (error: any) {
      console.error('Error sending intention:', error);
      return { success: false, error: error.message };
    }
  }

  async function deleteIntention(
    bivouacId: string,
    date: Date,
    people: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const body = {
        bivouacId: bivouacId,
        date: date,
        people: people,
      };
      const res = await api.delete(`/users/intention`, { data: body });
      if (res.status === 200) return { success: true };
      return {
        success: false,
        error: `Unexpected response status: ${res.status}`,
      };
    } catch (error: any) {
      console.error('Error deleting intention:', error);
      return { success: false, error: error.message };
    }
  }

  async function getIntentions(bivouacId?: string): Promise<Intention[]> {
    try {
      const body = bivouacId ? { bivouacId: bivouacId } : {};
      const res = await api.post(`/users/intentions`, body);
      const data = res.data;

      if (!data || !data.intentions || !Array.isArray(data.intentions))
        throw new Error('Invalid data structure received');

      const intentions: any[] = data.intentions;
      return intentions;
    } catch (error: any) {
      console.error('Error fetching intentions:', error);
      return [];
    }
  }

  return { sendIntention, deleteIntention, getIntentions };
});
