import api from '@/stores/utility/axiosInstance';
import type { Bivouac } from './bivouacs';
import { defineStore } from 'pinia';

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

  return { getFavoriteBivouacs };
});
