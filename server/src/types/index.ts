export const UserStatusEnum = {
  ACTIVE: 'active',
  BANNED: 'banned',
} as const;

export const UserTypeEnum = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const RegionsEnum = {
  Abruzzo: 'Abruzzo',
  Basilicata: 'Basilicata',
  Calabria: 'Calabria',
  Campania: 'Campania',
  Emilia_Romagna: 'Emilia-Romagna',
  Friuli_Venezia_Giulia: 'Friuli Venezia Giulia',
  Lazio: 'Lazio',
  Liguria: 'Liguria',
  Lombardia: 'Lombardia',
  Marche: 'Marche',
  Molise: 'Molise',
  Piemonte: 'Piemonte',
  Puglia: 'Puglia',
  Sardegna: 'Sardegna',
  Sicilia: 'Sicilia',
  Toscana: 'Toscana',
  Trentino_Alto_Adige: 'Trentino-Alto Adige',
  Umbria: 'Umbria',
  Valle_d_Aosta: "Valle d'Aosta",
  Veneto: 'Veneto',
} as const;

export const RouteDifficultyEnum = {
  T: 'T', // Turistico
  E: 'E', // Escursionistico
  EE: 'EE', // Escursionisti Esperti
  EEA: 'EEA', // Escursionisti Esperti con Attrezzatura
} as const;

export const RouteTypeEnum = {
  CIRCULAR: 'circular',
  OUT_AND_BACK: 'out-and-back',
  POINT_TO_POINT: 'point-to-point',
  STAGE: 'stage',
} as const;

export const RoutePathTypeEnum = {
  LINE_STRING: 'LineString',
  MULTI_LINE_STRING: 'MultiLineString',
} as const;

export const ProposalEnum = {
  ROUTE: 'route',
  BIVOUAC: 'bivouac',
} as const;

// Derive types automatically compile time
export type UserStatus = (typeof UserStatusEnum)[keyof typeof UserStatusEnum];
export type UserType = (typeof UserTypeEnum)[keyof typeof UserTypeEnum];
export type Region = (typeof RegionsEnum)[keyof typeof RegionsEnum];
export type RouteDifficulty =
  (typeof RouteDifficultyEnum)[keyof typeof RouteDifficultyEnum];
export type RouteType = (typeof RouteTypeEnum)[keyof typeof RouteTypeEnum];
export type RoutePathType =
  (typeof RoutePathTypeEnum)[keyof typeof RoutePathTypeEnum];
export type ProposalType = (typeof ProposalEnum)[keyof typeof ProposalEnum];

export type UUID = string;

export interface User {
  _id?: UUID;
  id?: string;
  name?: string;
  email?: string;
  type?: UserType;
  status?: UserStatus;
  creationDate?: Date;
  favRegions?: Region[];
  favoritesBivouacs?: string[];
  favoritesRoutes?: string[];
}

export interface Bivouac {
  _id?: UUID;
  id?: string;
  name?: string;
  region?: Region;
  mountainRange?: string;
  comune?: string;
  coords?: {
    latitude: number;
    longitude: number;
  };
  altitude?: number;
  capacity?: number;
  likes?: number;
  note?: string;
}

export interface Route {
  _id?: UUID;
  id?: string;
  title: string;
  region: Region[];
  difficulty: RouteDifficulty;
  distance: number;
  ascent: number;
  descent: number;
  duration: number;
  routeType: RouteType;
  likes?: number;
  note?: string;
  path?: {
    type: RoutePathType;
    coordinates: any[];
  };
}

export interface Proposal {
  senderEmail: string;
  type: ProposalType;
  subjectName: string;
  description: string;
  locality: string;
}

export interface Intention {
  _id: string;
  userId: string;
  bivouacId: string;
  reservedPlaces: number;
  reservationDate: Date;
}
