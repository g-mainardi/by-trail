import api from '@/stores/utility/axiosInstance';
import { defineStore } from 'pinia';
import type { LatLng } from 'leaflet';

type UUID = string;

export interface TrekkingRoute {
  _id: UUID;
  title: string;
  region: string[];
  difficulty: string;
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

export interface RouteResponse {
  routes: TrekkingRoute[];
  nextPage?: UUID;
}

export const useRouteStore = defineStore('routes', () => {
  async function fetchRoutes(): Promise<RouteResponse> {
    try {
      const res = await api.post('/routes/list', {});
      return res.data as RouteResponse;
    } catch (error: any) {
      console.error('Fetch Routes Error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch routes'
      );
    }
  }

  async function fetchMapRoutes(
    northWest: LatLng,
    southEast: LatLng
  ): Promise<TrekkingRoute[]> {
    const body = {
      topLeftCoords: { lat: northWest.lat, lng: northWest.lng },
      bottomRightCoords: { lat: southEast.lat, lng: southEast.lng },
    };

    try {
      const res = await api.post('/routes/map', body);
      const data = res.data;
      const rawRoutes = data.routes as TrekkingRoute[];

      // CLIENT-SIDE FIX:
      // MongoDB returns [Lng, Lat]. If Leaflet needs [Lat, Lng], we might need to swap them
      // or simply extract the start position here for the marker.
      return rawRoutes.map((route) => {
        if (
          route.path &&
          route.path.coordinates &&
          route.path.coordinates.length > 0
        ) {
          // We cast the first element to a tuple [number, number]
          const [lng, lat] = route.path.coordinates[0] as [number, number];

          if (typeof lat === 'number' && typeof lng === 'number') {
            route.startPosition = { lat, lng };
          }
        }
        return route;
      });
    } catch (error: any) {
      console.error('Fetch Map Routes Error:', error);
      throw new Error('Failed to fetch map routes');
    }
  }

  return { fetchRoutes, fetchMapRoutes };
});
