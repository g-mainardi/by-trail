import api from '@/stores/utility/axiosInstance';
import type { Route } from '@/types';
import type { LatLng } from 'leaflet';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type UUID = string;

export const DifficultyLevels = {
  T: 'T',
  E: 'E',
  EE: 'EE',
  EEA: 'EEA',
} as const;
export type DifficultyLevel =
  (typeof DifficultyLevels)[keyof typeof DifficultyLevels];

export interface TrekkingRoute {
  _id: UUID;
  title: string;
  region: string[];
  difficulty: DifficultyLevel;
  distance: number;
  ascent: number;
  descent: number;
  duration: number;
  routeType: string;
  likes: number;
  note?: string;
  path?: {
    type: 'LineString' | 'MultiLineString';
    coordinates: number[][];
  };
  startPosition?: { lat: number; lng: number };
}

export const useRouteStore = defineStore('routes', () => {
  // State

  const routes = ref<Route[]>([]);
  const mapRoutes = ref<Route[]>([]);

  // Actions

  const fetchRoutes = async () => {
    try {
      const res = await api.post('/routes/list', {});
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
          topLeftCoords: { lat: northWest.lat, lng: northWest.lng },
          bottomRightCoords: { lat: southEast.lat, lng: southEast.lng },
        },
      });
      const data = res.data;
      const routes = data.routes as Route[];
      mapRoutes.value = routes.map((route) => {
        if (
          route.path &&
          route.path.coordinates &&
          route.path.coordinates.length > 0
        ) {
          const [lng, lat] = route.path.coordinates[0] as [number, number];
          if (typeof lat === 'number' && typeof lng === 'number') {
            route.path.coordinates[0] = { lat, lng };
          }
        }
        return route;
      });
    } catch (error: any) {
      console.error('Error fetching map routes:', error);
      throw new Error('Failed to fetch map routes');
    }
  };

  return { fetchRoutes, fetchMapRoutes, routes, mapRoutes };
});
