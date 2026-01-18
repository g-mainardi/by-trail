import { defineStore } from 'pinia';
import api from './utility/axiosInstance';

export interface Intention {
  _id: string;
  bivouacId: string;
  reservationDate: Date;
  reservedPlaces: number;
}

export const useIntentionStore = defineStore('intentions', () => {
  async function sendIntention(
    bivouacId: string,
    date: Date,
    people: number
  ): Promise<{ success: boolean; error?: string; message?: string }> {
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
  }

  async function deleteIntention(
    intentionId: string
  ): Promise<{ success: boolean; error?: string; message?: string }> {
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
  }

  async function getUserIntentions(bivouacId?: string): Promise<Intention[]> {
    try {
      const res = await api.get(`/users/intentions`, {
        params: { ID: bivouacId },
      });

      const data = res.data;
      if (!data || !data.intentions || !Array.isArray(data.intentions))
        throw new Error('Invalid data structure received');

      const intentions: Intention[] = data.intentions;
      return intentions;
    } catch (error: any) {
      console.error('Error fetching intentions:', error);
      return [];
    }
  }

  return {
    sendIntention,
    deleteIntention,
    getUserIntentions,
  };
});
