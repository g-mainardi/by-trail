import { Request } from 'express';

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

// Derive types automatically compile time
export type UserStatus = (typeof UserStatusEnum)[keyof typeof UserStatusEnum];
export type UserType = (typeof UserTypeEnum)[keyof typeof UserTypeEnum];
export type Region = (typeof RegionsEnum)[keyof typeof RegionsEnum];

export interface UserDocument {
  _id?: string;
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

export interface BivouacDocument {
  _id?: string;
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

export interface AuthRequest extends Request {
  user?: UserDocument | null;
}
