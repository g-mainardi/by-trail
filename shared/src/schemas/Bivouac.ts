import { z } from 'zod';
import { ImageSchema, RegionSchema } from './common.js';

// Bivouac sub-schemas (Nested Objects)
const CoordsSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

// Main schema
export const BivouacZodSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  region: RegionSchema,
  mountainRange: z.string().min(1),
  comune: z.string().min(1),
  coords: CoordsSchema,
  altitude: z.number().int().nonnegative(),
  capacity: z.number().int().nonnegative(),
  note: z.string().optional(),
  images: z.array(ImageSchema).optional(),
});

// Infer the TypeScript type from the Zod schema
export type Bivouac = z.infer<typeof BivouacZodSchema>;

// Also infer specific field types if needed
export type BivouacCoords = z.infer<typeof CoordsSchema>;
