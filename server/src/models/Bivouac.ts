import mongoose, { Schema, Document } from 'mongoose';
import { Bivouac, RegionsEnum } from '@by-trail/shared';

// Extend Shared Type
export interface BivouacDocument extends Omit<Bivouac, '_id'>, Document {}

const bivouacSchema = new Schema<BivouacDocument>(
  {
    name: { type: String, required: true },
    region: {
      type: String,
      required: true,
      enum: Object.values(RegionsEnum),
    },
    mountainRange: { type: String, required: true },
    comune: { type: String, required: true },
    coords: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    altitude: { type: Number, required: true },
    capacity: { type: Number, required: true },
    note: { type: String },
    images: [
      {
        data: Buffer,
        contentType: String,
        name: String,
        uploadDate: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const BivouacModel = mongoose.model<BivouacDocument>(
  'Bivouac',
  bivouacSchema
);
