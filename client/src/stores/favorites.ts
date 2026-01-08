import { HttpHelper } from '@/stores/utility/httpHelper';
import { ref } from 'vue';
import type { BivouacResponse } from './bivouacs';
import { defineStore } from 'pinia';

export const useFavoriteStore = defineStore('bivouacs', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const httpHelper = new HttpHelper('/api', token.value || undefined);

  async function getFavoriteBivouacs(): Promise<BivouacResponse> {
    const res = await httpHelper.get('/bivouacs/favorites');
    const data = await res.json();
    if (!res.ok) {
      console.error('Fetch Favorites Bivouacs Error:', data);
      throw new Error('Failed to fetch bivouacs');
    }
    return data as BivouacResponse;
  }

  return { getFavoriteBivouacs };
});
