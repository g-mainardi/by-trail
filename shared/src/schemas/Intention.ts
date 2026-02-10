import { z } from 'zod';

// Main schema
export const IntentionZodSchema = z.object({
  _id: z.string().optional(),
  user: z.string(),
  bivouac: z.string(),
  reservedPlaces: z.number().min(1, 'At least one place must be reserved'),
  intentionDate: z.coerce.date(),
});

// Infer the TypeScript type from the Zod schema
export type Intention = z.infer<typeof IntentionZodSchema>;
