import { z } from 'zod';

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

export const RegionSchema = z.nativeEnum(RegionsEnum);

export const ImageContentSchema = z.object({
  data: z.any(), // Buffer type
  contentType: z.string(),
});

export const ImageSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  ...ImageContentSchema.shape,
  uploadDate: z.coerce.date(),
});

export type Image = z.infer<typeof ImageSchema>;

export type Region = z.infer<typeof RegionSchema>;
