import api from '@/stores/utility/axiosInstance';
import { defineStore } from 'pinia';
import type { Bivouac } from './bivouacs';

export const useFavoriteStore = defineStore('favorites', () => {
  async function getFavoriteBivouacs(): Promise<Bivouac[]> {
    try {
      const res = await api.get('/users/favorites/bivouacs', {});
      const data = res.data;

      if (!data || !data.bivouacs || !Array.isArray(data.bivouacs))
        throw new Error('Invalid data structure received');

      const bivouacs: Bivouac[] = data.bivouacs;

      if (bivouacs.some((item) => item == null || item === undefined)) {
        console.warn(
          'Warning: Some favorite bivouacs are null or undefined, filtering them out.',
          bivouacs
        );
        return bivouacs.filter(
          (item: Bivouac) => item !== null && item !== undefined
        );
      }
      return bivouacs;
    } catch (error: any) {
      console.error('Error fetching favorite bivouacs:', error);
      return [];
    }
  }

  async function addFavoriteBivouac(
    bivouacId: string
  ): Promise<{ success: boolean; error?: string }> {
    // post /favorites/bivouacs params: user id and bivouac id
    try {
      const body = { id: bivouacId };
      const res = await api.post(`/users/favorites/bivouacs/`, body);
      if (res.status === 200 || res.status === 201) return { success: true };
      return {
        success: false,
        error: `Unexpected response status: ${res.status}`,
      };
    } catch (error: any) {
      console.error('Error adding favorite bivouac:', error);
      return { success: false, error: error };
    }
  }

  async function removeFavoriteBivouac(
    bivouacId: string
  ): Promise<{ success: boolean; error?: string }> {
    // delete /favorites/bivouacs params: user id and bivouac id
    try {
      const body = { id: bivouacId };
      const res = await api.delete(`/users/favorites/bivouacs`, { data: body });
      if (res.status === 200) return { success: true };
      return {
        success: false,
        error: `Unexpected response status: ${res.status}`,
      };
    } catch (error: any) {
      console.error('Error removing favorite bivouac:', error);
      return { success: false, error: error };
    }
  }

  return {
    getFavoriteBivouacs,
    addFavoriteBivouac,
    removeFavoriteBivouac,
  };
});
