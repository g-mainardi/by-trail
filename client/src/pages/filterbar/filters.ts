import type { Bivouac } from '@/stores/bivouacs';
import { ref } from 'vue';

export interface Filter {
  currentValue?: any;
  default: any;
  predicate: (bivouac: Bivouac, value: any) => boolean;
}

const minDesiredBeds: Filter = {
  currentValue: 0,
  default: 0,
  predicate: (bivouac: Bivouac, value: number) => {
    return bivouac.capacity !== undefined ? bivouac.capacity >= value : true;
  },
};

const altitudeFilter: Filter = {
  currentValue: { min: 0, max: 10000 },
  default: { min: 0, max: 10000 },
  predicate: (bivouac: Bivouac, value: { min: number; max: number }) => {
    const altitude = bivouac.altitude;
    if (altitude !== undefined) {
      return altitude >= value.min && altitude <= value.max;
    }
    return true;
  },
};

const searchQuery: Filter = {
  currentValue: '',
  default: '',
  predicate: (bivouac: Bivouac, value: string) => {
    if (!value) return true;
    const query = value.toLowerCase();
    return (
      bivouac.name.toLowerCase().includes(query) ||
      (bivouac.note !== undefined && bivouac.note.toLowerCase().includes(query))
    );
  },
};

const filters = ref({
  minDesiredBeds: minDesiredBeds,
  altitudeFilter: altitudeFilter,
  searchQuery: searchQuery,
});

function resetFilters() {
  Object.values(filters.value).forEach((filter) => {
    filter.currentValue = JSON.parse(JSON.stringify(filter.default));
  });
}

function getFilteredBivouacs(bivouacs: Bivouac[]): Bivouac[] {
  return bivouacs.filter((bivouac) => {
    return Object.values(filters.value).every((filter) =>
      filter.predicate(bivouac, filter.currentValue)
    );
  });
}

export { filters, getFilteredBivouacs, resetFilters };
