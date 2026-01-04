import { HttpHelper } from '@/stores/utility/httpHelper';
import { defineStore } from 'pinia';
import { ref } from 'vue';
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
    const token = ref<string | null>(localStorage.getItem('token'));
    const httpHelper = new HttpHelper('/api', token.value || undefined);

    async function fetchRoutes(): Promise<RouteResponse> {
        const res = await httpHelper.post('/routes/list', {});
        const data = await res.json();

        if (!res.ok) {
            console.error('Fetch Routes Error:', data);
            throw new Error('Failed to fetch routes');
        }

        return data as RouteResponse;
    }

    async function fetchMapRoutes(northWest: LatLng, southEast: LatLng): Promise<TrekkingRoute[]> {
    const body = {
      topLeftCoords: { lat: northWest.lat, lng: northWest.lng },
      bottomRightCoords: { lat: southEast.lat, lng: southEast.lng }
    };
    
    const res = await httpHelper.post('/routes/map', body);
    if (!res.ok) throw new Error('Failed to fetch map routes');
    
    const data = await res.json();
    const rawRoutes = data.routes as TrekkingRoute[];

    // CLIENT-SIDE FIX:
    // MongoDB returns [Lng, Lat]. If Leaflet needs [Lat, Lng], we might need to swap them
    // or simply extract the start position here for the marker.
    
    return rawRoutes.map(route => {
        if (route.path && route.path.coordinates && route.path.coordinates.length > 0) {
    // We cast the first element to a tuple [number, number]
            const [lng, lat] = route.path.coordinates[0] as [number, number];

            if (typeof lat === 'number' && typeof lng === 'number') {
                route.startPosition = { lat, lng };
            }
        }
        return route;
    });
  }

  return { fetchRoutes, fetchMapRoutes };
});

