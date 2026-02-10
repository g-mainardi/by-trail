import { z } from 'zod';
import { RegionSchema } from './common.js';

// Proposal-specific enums
export const ProposalEnum = {
  ROUTE: 'route',
  BIVOUAC: 'bivouac',
} as const;

// Main schema
export const ProposalZodSchema = z.object({
  _id: z.string().optional(),
  type: z.nativeEnum(ProposalEnum),
  subjectName: z.string().min(1),
  description: z.string().min(1),
  region: RegionSchema,
  locality: z.string().min(1),
  submissionDate: z.coerce.date().optional(),
});

// Secondary schema including sender's email
export const ProposalWithEmailZodSchema = ProposalZodSchema.extend({
  senderEmail: z.string().email('Invalid email format').optional(),
});

// Infer the TypeScript type from the Zod schema
export type Proposal = z.infer<typeof ProposalZodSchema>;
export type ProposalWithEmail = z.infer<typeof ProposalWithEmailZodSchema>;

// Also infer specific field types if needed
export type ProposalType = (typeof ProposalEnum)[keyof typeof ProposalEnum];
