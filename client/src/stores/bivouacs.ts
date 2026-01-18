import api from '@/stores/utility/axiosInstance';
import type { Bivouac } from '@/types';
import type { LatLng } from 'leaflet';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBivouacStore = defineStore('bivouacs', () => {
  // State

  const bivouacs = ref<Bivouac[]>([]);
  const mapBivouacs = ref<Bivouac[]>([]);

  // Actions

  const fetchBivouacs = async () => {
    try {
      const res = await api.get('/bivouacs/list');
      const data = res.data;
      bivouacs.value = data.bivouacs as Bivouac[];
    } catch (error: any) {
      console.error('Error fetching bivouacs:', error);
      throw new Error('Failed to fetch bivouacs');
    }
  };

  const fetchMapBivouacs = async (northWest: LatLng, southEast: LatLng) => {
    try {
      const res = await api.get('/bivouacs/map', {
        params: {
          latNw: northWest.lat,
          lngNw: northWest.lng,
          latSe: southEast.lat,
          lngSe: southEast.lng,
        },
      });
      const data = res.data;
      mapBivouacs.value = data.bivouacs as Bivouac[];
    } catch (error: any) {
      console.error('Error fetching map bivouacs:', error);
      throw new Error('Failed to fetch map bivouacs');
    }
  };

  const getBivouacById = async (id: string): Promise<Bivouac> => {
    try {
      const res = await api.get(`/bivouacs/bivouac`, { params: { id } });
      const data = res.data;
      return data.bivouac as Bivouac;
    } catch (error: any) {
      console.error('Error fetching bivouac by ID:', error);
      throw new Error('Failed to fetch bivouac by ID');
    }
  };

  return {
    fetchBivouacs,
    fetchMapBivouacs,
    getBivouacById,
    mapBivouacs,
    bivouacs,
  };
});
