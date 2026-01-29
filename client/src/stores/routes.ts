import api from '@/stores/utility/axiosInstance';
import type { Route } from '@by-trail/shared';
import type { LatLng } from 'leaflet';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRouteStore = defineStore('routes', () => {
  // State

  const routes = ref<Route[]>([]);

  // Actions

  const fetchRoutes = async (northWest?: LatLng, southEast?: LatLng) => {
    try {
      const res = await api.get('/routes', {
        params: {
          latNw: northWest?.lat,
          lngNw: northWest?.lng,
          latSe: southEast?.lat,
          lngSe: southEast?.lng,
        },
      });
      const data = res.data;
      const receivedRoutes = data.routes as Route[];
      routes.value = receivedRoutes.map((route) => {
        if (
          route.path &&
          route.path.coordinates &&
          route.path.coordinates.length > 0
        ) {
          route.path.coordinates = normalizeCoordinates(route.path.coordinates);
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
      const cachedRoute = routes.value.find((route) => route._id === id);
      if (cachedRoute) return cachedRoute;

      const res = await api.get(`/routes/${id}`);
      const data = res.data;
      const route = data.route as Route;
      if (
        route.path &&
        route.path.coordinates &&
        route.path.coordinates.length > 0
      ) {
        route.path.coordinates = normalizeCoordinates(route.path.coordinates);
      }
      return route;
    } catch (error: any) {
      console.error('Error fetching route by ID:', error);
      throw new Error('Failed to fetch route by ID');
    }
  };

  type Coordinate = { 0: number; 1: number; 2?: number };
  type NormalizedCoordinate = { lat: number; lng: number };

  function normalizeCoordinates(coords: Coordinate[]): NormalizedCoordinate[] {
    return coords.map((coord) => {
      const [lng, lat] = coord as [number, number];
      return { lat, lng };
    });
  }

  return { fetchRoutes, fetchRouteById, routes };
});
