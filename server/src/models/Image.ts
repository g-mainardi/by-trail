import mongoose, { Schema, Document } from 'mongoose';
import { Image } from '@by-trail/shared';

export interface ImageDocument extends Omit<Image, '_id'>, Document {}

const imageSchema = new Schema<ImageDocument>({
  name: String,
  data: Buffer,
  contentType: String,
  uploadDate: { type: Date, default: Date.now },
});

export const ImageModel = mongoose.model<ImageDocument>('Image', imageSchema);
