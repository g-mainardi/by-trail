import api from '@/stores/utility/axiosInstance';
import type { Bivouac } from '@/types';
import type { LatLng } from 'leaflet';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBivouacStore = defineStore('bivouacs', () => {
  // State

  const bivouacs = ref<Bivouac[]>([]);

  const fetchBivouacs = async (northWest?: LatLng, southEast?: LatLng) => {
    try {
      const res = await api.get('/bivouacs', {
        params: {
          latNw: northWest?.lat,
          lngNw: northWest?.lng,
          latSe: southEast?.lat,
          lngSe: southEast?.lng,
        },
      });
      const data = res.data;
      bivouacs.value = data.bivouacs as Bivouac[];
    } catch (error: any) {
      console.error('Error fetching map bivouacs:', error);
      throw new Error('Failed to fetch map bivouacs');
    }
  };

  const getBivouacById = async (id: string): Promise<Bivouac> => {
    try {
      const cachedBivouac = bivouacs.value.find(
        (bivouac) => bivouac._id === id
      );
      if (cachedBivouac) return cachedBivouac;
      const res = await api.get(`/bivouacs/${id}`);
      const data = res.data;
      return data.bivouac as Bivouac;
    } catch (error: any) {
      console.error('Error fetching bivouac by ID:', error);
      throw new Error('Failed to fetch bivouac by ID');
    }
  };

  return {
    fetchBivouacs,
    getBivouacById,
    bivouacs,
  };
});
