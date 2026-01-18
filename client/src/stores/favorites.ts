import api from '@/stores/utility/axiosInstance';
import type { Bivouac, Route } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

interface FavoritesResponse {
  success: boolean;
  error?: string;
}

export const useFavoriteStore = defineStore('favorites', () => {
  // State
  const bivouacFavorites = ref<Bivouac[]>([]);
  const routeFavorites = ref<Route[]>([]);

  const fetchBivouacFavorites = async () => {
    try {
      const res = await api.get('/users/favorites/bivouacs');
      const data = res.data;
      bivouacFavorites.value = data.bivouacs as Bivouac[];
    } catch (error) {
      console.error('Error fetching favorite bivouacs:', error);
    }
  };

  const addFavoriteBivouac = async (
    bivouacId: string
  ): Promise<FavoritesResponse> => {
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
  };

  const deleteFavoriteBivouac = async (
    bivouacId: string
  ): Promise<FavoritesResponse> => {
    try {
      const body = { id: bivouacId };
      const res = await api.delete(`/users/favorites/bivouacs`, { data: body });
      if (res.status === 204) return { success: true };
      return {
        success: false,
        error: `Unexpected response status: ${res.status}`,
      };
    } catch (error: any) {
      console.error('Error removing favorite bivouac:', error);
      return { success: false, error: error };
    }
  };

  const fetchFavoriteRoutes = async () => {
    try {
      const res = await api.get('/users/favorites/routes');
      const data = res.data;

      if (!data || !data.routes || !Array.isArray(data.routes))
        throw new Error('Invalid data structure received');

      return data.routes as Route[];
    } catch (error: any) {
      console.error('Error fetching favorite routes:', error);
      return [];
    }
  };

  const addFavoriteRoute = async (
    routeId: string
  ): Promise<FavoritesResponse> => {
    try {
      const body = { id: routeId };
      const res = await api.post(`/users/favorites/routes/`, body);
      if (res.status === 200 || res.status === 201) return { success: true };
      return {
        success: false,
        error: `Unexpected response status: ${res.status}`,
      };
    } catch (error: any) {
      console.error('Error adding favorite route:', error);
      return { success: false, error: error };
    }
  };

  const deleteFavoriteRoute = async (
    routeId: string
  ): Promise<FavoritesResponse> => {
    try {
      const body = { id: routeId };
      const res = await api.delete(`/users/favorites/routes`, { data: body });
      if (res.status === 204) return { success: true };
      return {
        success: false,
        error: `Unexpected response status: ${res.status}`,
      };
    } catch (error: any) {
      console.error('Error removing favorite route:', error);
      return { success: false, error: error };
    }
  };

  async function toggleFavoriteBivouac(bivouacId: string) {
    let res: { success: boolean; error?: string } = {
      success: false,
    };
    if (isFavoriteBivouac(bivouacId)) {
      res = await deleteFavoriteBivouac(bivouacId);
    } else {
      res = await addFavoriteBivouac(bivouacId);
    }
    if (res.success) await fetchBivouacFavorites();
    else console.log(res.error);
  }

  async function toggleFavoriteRoute(routeId: string) {
    let res: { success: boolean; error?: string } = {
      success: false,
    };
    if (isFavoriteRoute(routeId)) {
      res = await deleteFavoriteRoute(routeId);
    } else {
      res = await addFavoriteRoute(routeId);
    }
    if (res.success) await fetchFavoriteRoutes();
    else console.log(res.error);
  }

  function isFavoriteBivouac(bivouacId: string): boolean {
    return bivouacFavorites.value.some((bivouac) => bivouac._id === bivouacId);
  }

  function isFavoriteRoute(routeId: string): boolean {
    return routeFavorites.value.some((route) => route._id === routeId);
  }

  return {
    bivouacFavorites,
    routeFavorites,
    fetchBivouacFavorites,
    addFavoriteBivouac,
    deleteFavoriteBivouac,
    fetchFavoriteRoutes,
    addFavoriteRoute,
    deleteFavoriteRoute,
    toggleFavoriteBivouac,
    toggleFavoriteRoute,
    isFavoriteBivouac,
    isFavoriteRoute,
  };
});
