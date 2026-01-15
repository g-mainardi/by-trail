import type { Bivouac } from '@/stores/bivouacs';
import type { TrekkingRoute } from '@/stores/routes';
import { ref } from 'vue';

export interface BivouacFilter {
  currentValue?: any;
  default: any;
  predicate: (bivouac: Bivouac, value: any) => boolean;
}

export interface TrekkingRouteFilter {
  currentValue?: any;
  default: any;
  predicate: (route: TrekkingRoute, value: any) => boolean;
}

const minDesiredBeds: BivouacFilter = {
  currentValue: 0,
  default: 0,
  predicate: (bivouac: Bivouac, value: number) => {
    return bivouac.capacity !== undefined ? bivouac.capacity >= value : true;
  },
};

const altitudeFilter: BivouacFilter = {
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

const searchQuery: BivouacFilter = {
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

const maxDurationFilter: TrekkingRouteFilter = {
  currentValue: { hour: 8, minute: 0 },
  default: { hour: 8, minute: 0 },
  predicate: (route: TrekkingRoute, value: any) => {
    if (route.duration !== undefined) {
      return route.duration <= value.hour * 60 + value.minute;
    }
    return true;
  },
};

// Filter 2: Difficulty
const difficultyFilter: TrekkingRouteFilter = {
  currentValue: 'All',
  default: 'All',
  predicate: (route: TrekkingRoute, value: any) => {
    if (value === 'All') return true;
    return route.difficulty === value;
  },
};

const bivouacFilters = ref({
  minDesiredBeds: minDesiredBeds,
  altitudeFilter: altitudeFilter,
  searchQuery: searchQuery,
});

const routeFilters = ref({
  maxDurationFilter: maxDurationFilter,
  difficultyFilter: difficultyFilter,
});

function resetBivouacFilters() {
  Object.values(bivouacFilters.value).forEach((filter) => {
    filter.currentValue = JSON.parse(JSON.stringify(filter.default));
  });
}

function resetRoutesFilters() {
  Object.values(routeFilters.value).forEach((filter) => {
    filter.currentValue = JSON.parse(JSON.stringify(filter.default));
  });
}

function getFilteredBivouacs(bivouacs: Bivouac[]): Bivouac[] {
  return bivouacs.filter((bivouac) => {
    return Object.values(bivouacFilters.value).every((filter) =>
      filter.predicate(bivouac, filter.currentValue)
    );
  });
}

function getFilteredRoutes(routes: TrekkingRoute[]): TrekkingRoute[] {
  return routes.filter((route) => {
    return Object.values(routeFilters.value).every((filter) =>
      filter.predicate(route, filter.currentValue)
    );
  });
}

export {
  bivouacFilters as bivouacFilters,
  getFilteredBivouacs,
  getFilteredRoutes,
  resetBivouacFilters,
  resetRoutesFilters,
  routeFilters,
};
