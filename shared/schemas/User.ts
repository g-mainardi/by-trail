import { z } from 'zod';
import { RegionsEnum } from './common.js';

// User-specific Enums
export const UserStatusEnum = {
  ACTIVE: 'active',
  BANNED: 'banned',
} as const;

export const UserTypeEnum = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// Main Schema
export const UserZodSchema = z.object({
  // Using .optional() because usually _id is not present when creating a new user on client
  _id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 chars'),
  email: z.string().email('Invalid email format'),
  type: z.nativeEnum(UserTypeEnum).default(UserTypeEnum.USER),
  status: z.nativeEnum(UserStatusEnum).default(UserStatusEnum.ACTIVE),
  creationDate: z.coerce.date().default(() => new Date()), // z.coerce handles string-to-date from JSON
  favRegions: z.array(z.nativeEnum(RegionsEnum)).default([]),

  // Handling References: In the shared schema, these are likely arrays of ID strings.
  // Mongoose will store them as ObjectIds, but Zod validates the i/o shape.
  favoritesBivouacs: z.array(z.string()).default([]),
  favoritesRoutes: z.array(z.string()).default([]),
});

// Infer the TypeScript Type directly from Zod
export type User = z.infer<typeof UserZodSchema>;
