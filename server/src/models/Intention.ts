import mongoose, { Schema, Document } from 'mongoose';
import { Intention } from '@by-trail/shared';

// Extend Shared Type: user and bivouac become ObjectIds
export interface IntentionDocument
  extends Omit<Intention, '_id' | 'user' | 'bivouac'>, Document {
  user: mongoose.Types.ObjectId;
  bivouac: mongoose.Types.ObjectId;
}

const intentionSchema = new Schema<IntentionDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bivouac: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bivouac',
      required: true,
    },
    reservedPlaces: { type: Number, required: true },
    intentionDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const IntentionModel = mongoose.model<IntentionDocument>(
  'Intention',
  intentionSchema
);
