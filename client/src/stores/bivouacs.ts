import api from '@/stores/utility/axiosInstance';
import type { LatLng } from 'leaflet';
import { defineStore } from 'pinia';

type UUID = string;

// How will be:
// export interface Bivouac {
//   _id?: string;
//   name: string;
//   description?: string;
//   region: string;
//   type: 'bivouac' | 'refuge';
//   mountainRange?: string; // ???
//   comune: string;
//   position: {
//     latitude: number;
//     longitude: number;
//   }
//   altitude: number;
//   capacity: number;
//   openDate?: Date;
//   closeDate?: Date;
//   hasToilets?: boolean;
//   likes?: number;
//   isOpen?: boolean;
//   isFavorite: boolean;
// }

export interface Bivouac {
  _id: UUID;
  name: string;
  region: string;
  mountainRange: string;
  comune: string;
  coords: {
    latitude: number;
    longitude: number;
  };
  altitude: number;
  capacity: number;
  likes: number;
  note?: string;
}

export interface BivouacResponse {
  bivouacs: Bivouac[];
  nextPage?: UUID;
}

interface RequestOptions {
  region?: string;
  favoritesOnly?: boolean;
  sortByLikes?: 'asc' | 'desc';
  pageSize?: number; // Default to 50 if not provided
}

export const useBivouacStore = defineStore('bivouacs', () => {
  async function fetchBivouacs(
    options?: RequestOptions,
    nextPage?: UUID
  ): Promise<BivouacResponse> {
    const body = {
      options: options,
      nextPage: nextPage,
    };

    try {
      const res = await api.post('/bivouacs/list', body);
      return res.data as BivouacResponse;
    } catch (error) {
      console.error('Fetch Bivouacs Error:', error);
      throw new Error('Failed to fetch bivouacs');
    }
  }

  async function fetchMapBivouacs(
    northWest: LatLng,
    southEast: LatLng
  ): Promise<Bivouac[]> {
    const body = {
      topLeftCoords: { lat: northWest.lat, lng: northWest.lng },
      bottomRightCoords: { lat: southEast.lat, lng: southEast.lng },
    };

    try {
      const res = await api.post('/bivouacs/map', body);
      return res.data.bivouacs as Bivouac[];
    } catch (error) {
      throw new Error('Failed to fetch map bivouacs');
    }
  }

  async function getBivouacById(id: UUID): Promise<Bivouac> {
    try {
      const res = await api.get(`/bivouacs/bivouac`, { params: { id } });
      return res.data.bivouac as Bivouac;
    } catch (error) {
      throw new Error('Failed to fetch bivouac by ID');
    }
  }

  return { fetchBivouacs, fetchMapBivouacs, getBivouacById };
});
