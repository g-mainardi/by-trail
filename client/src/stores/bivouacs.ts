import { HttpHelper } from '@/stores/utility/httpHelper';
import type { LatLng } from 'leaflet';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type UUID = string;

// How will be:
// export interface Bivouac {
//   _id?: string;
//   name: string;
//   description?: string;
//   region: string;
//   type: 'bivouac' | 'refuge';
//   mountainRange?: string; // ???
//   position: {
//     latitude: number;
//     longitude: number;
//     altitude: number;
//   }
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
  comune?: string;
  coords: {
    latitude: number;
    longitude: number;
    altitude: number;
  }
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

  const token = ref<string | null>(localStorage.getItem('token'));
  const httpHelper = new HttpHelper('/api', token.value || undefined);

  async function fetchBivouacs(options?: RequestOptions, nextPage?: UUID): Promise<BivouacResponse> {

    const body = {
      options: options,
      nextPage: nextPage
    };

    const res = await httpHelper.post('/bivouacs/list', body);
    const data = await res.json();
    if (!res.ok) {
      console.error('Fetch Bivouacs Error:', data);
      throw new Error('Failed to fetch bivouacs');
    }
    return data as BivouacResponse;
  }

  async function fetchMapBivouacs(northWest: LatLng, southEast: LatLng):
    Promise<Bivouac[]> {
    const body = {
      topLeftCoords: { lat: northWest.lat, lng: northWest.lng },
      bottomRightCoords: { lat: southEast.lat, lng: southEast.lng }
    };
    const res = await httpHelper.post('/bivouacs/map', body);
    const data = await res.json();
    if (!res.ok) {
      throw new Error('Failed to fetch map bivouacs');
    };
    return data.bivouacs as Bivouac[];
  }

  return { fetchBivouacs, fetchMapBivouacs };

});
