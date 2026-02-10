import mongoose, { Schema, Document } from 'mongoose';
import {
  Route,
  RegionsEnum,
  RouteDifficultyEnum,
  RoutePathTypeEnum,
  RouteTypeEnum,
} from '@by-trail/shared';

// Extend Shared Type
export interface RouteDocument extends Omit<Route, '_id'>, Document {}

const routeSchema = new Schema<RouteDocument>(
  {
    title: { type: String, required: true },
    region: {
      type: [{ type: String, enum: Object.values(RegionsEnum) }],
      required: true,
      default: [],
    },
    difficulty: {
      type: String,
      enum: Object.values(RouteDifficultyEnum),
      required: true,
    },
    distance: { type: Number, required: true },
    ascent: { type: Number, required: true },
    descent: { type: Number, required: true },
    duration: { type: Number, required: true },
    routeType: {
      type: String,
      enum: Object.values(RouteTypeEnum),
      required: true,
    },
    note: { type: String },
    path: {
      type: {
        type: String,
        enum: Object.values(RoutePathTypeEnum),
        required: true,
      },
      coordinates: {
        type: [], // GeoJSON structure
        required: true,
      },
    },
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

export const RouteModel = mongoose.model<RouteDocument>('Route', routeSchema);
