import api from '@/stores/utility/axiosInstance';
import type { Route } from '@/types';
import type { LatLng } from 'leaflet';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRouteStore = defineStore('routes', () => {
  // State

  const routes = ref<Route[]>([]);
  const mapRoutes = ref<Route[]>([]);

  // Actions

  const fetchRoutes = async () => {
    try {
      const res = await api.get('/routes/list');
      const data = res.data;
      routes.value = data.routes as Route[];
    } catch (error: any) {
      console.error('Error fetching routes:', error);
      throw new Error('Failed to fetch routes');
    }
  };

  const fetchMapRoutes = async (northWest: LatLng, southEast: LatLng) => {
    try {
      const res = await api.get('/routes/map', {
        params: {
          latNw: northWest.lat,
          lngNw: northWest.lng,
          latSe: southEast.lat,
          lngSe: southEast.lng,
        },
      });
      const data = res.data;
      const routes = data.routes as Route[];
      // Trasformiamo le coordinate per ogni route
      mapRoutes.value = routes.map((route) => {
        if (
          route.path &&
          route.path.coordinates &&
          route.path.coordinates.length > 0
        ) {
          // Mappiamo l'INTERO array di coordinate
          // I dati arrivano come [Lng, Lat, Alt] -> Li trasformiamo in [Lat, Lng]
          route.path.coordinates = route.path.coordinates.map((coord: any) => {
            const [lng, lat] = coord as [number, number];
            // Imposta tutte le coordinate come oggetto { lat, lng }
            return { lat, lng };
          });
        }
        return route;
      });
    } catch (error: any) {
      console.error('Error fetching map routes:', error);
      throw new Error('Failed to fetch map routes');
    }
  };

  const fetchRouteById = async (id: string): Promise<Route> => {
    try {
      const res = await api.get(`/routes/route`, { params: { id } });
      const data = res.data;
      return data.route as Route;
    } catch (error: any) {
      console.error('Error fetching route by ID:', error);
      throw new Error('Failed to fetch route by ID');
    }
  };

  return { fetchRoutes, fetchMapRoutes, fetchRouteById, routes, mapRoutes };
});
