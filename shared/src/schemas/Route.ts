import { z } from 'zod';
import { ImageSchema, RegionSchema } from './common.js';

// Route-specific enums
export const RouteDifficultyEnum = {
  T: 'T', // Turistico
  E: 'E', // Escursionistico
  EE: 'EE', // Escursionisti Esperti
  EEA: 'EEA', // Escursionisti Esperti con Attrezzatura
} as const;

export const RouteTypeEnum = {
  CIRCULAR: 'Circular',
  OUT_AND_BACK: 'Out-and-Back',
  POINT_TO_POINT: 'Point-to-Point',
  STAGE: 'Stage',
} as const;

export const RoutePathTypeEnum = {
  LINE_STRING: 'LineString',
  MULTI_LINE_STRING: 'MultiLineString',
} as const;

// Route sub-schemas (Nested Objects)
const PathObjSchema = z.object({
  type: z.nativeEnum(RoutePathTypeEnum),
  coordinates: z.array(z.any()), //todo can be eventually more specific: z.array(z.tuple([z.number(), z.number()]))
});

// Main schema
export const RouteZodSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1),
  region: z.array(RegionSchema).min(1, 'Must have at least one region'),
  difficulty: z.nativeEnum(RouteDifficultyEnum),
  distance: z.number().positive(),
  ascent: z.number().nonnegative(),
  descent: z.number().nonnegative(),
  duration: z.number().positive(), //todo minutes or hours?
  routeType: z.nativeEnum(RouteTypeEnum),
  note: z.string().optional(),
  path: PathObjSchema.optional(),
  images: z.array(ImageSchema).optional(),
});

// Infer the TypeScript type from the Zod schema
export type Route = z.infer<typeof RouteZodSchema>;

// Also infer specific field types if needed
export type RouteDifficulty = z.infer<typeof RouteZodSchema>['difficulty'];
export type RouteType = z.infer<typeof RouteZodSchema>['routeType'];
export type RoutePathType = z.infer<typeof PathObjSchema>['type'];
export type PathObj = z.infer<typeof PathObjSchema>;
