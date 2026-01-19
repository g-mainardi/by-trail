import mongoose from 'mongoose';
import {
  ProposalEnum,
  RegionsEnum,
  RouteDifficultyEnum,
  RoutePathTypeEnum,
  RouteTypeEnum,
  UserStatusEnum,
  UserTypeEnum,
} from '../types/index.js';
import {
  BivouacDocument,
  ProposalDocument,
  RouteDocument,
  UserDocument,
} from '../types/server_only.js';

const { Schema } = mongoose;

/**************************************** Schemas ****************************************/
// USER
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  creationDate: { type: Date, default: Date.now },
  favRegions: [{ type: String, enum: Object.values(RegionsEnum) }],
  status: {
    type: String,
    enum: Object.values(UserStatusEnum),
    default: UserStatusEnum.ACTIVE,
  },
  favoritesBivouacs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Bivouac',
    default: [],
  },
  favoritesRoutes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Route',
    default: [],
  },
  type: {
    type: String,
    enum: Object.values(UserTypeEnum),
    default: UserTypeEnum.USER,
  },
});

// BIVOUAC
const bivouacSchema = new Schema(
  {
    name: { type: String, required: true },
    region: { type: String, required: true },
    mountainRange: { type: String, required: true },
    comune: { type: String, required: true },
    coords: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    altitude: { type: Number, required: true },
    capacity: { type: Number, required: true },
    likes: { type: Number, default: 0, min: 0 },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

// ROUTE
const routeSchema = new Schema(
  {
    title: { type: String, required: true },
    region: {
      type: [{ type: String, enum: Object.values(RegionsEnum) }],
      required: true,
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'A route must have at least one region.',
      },
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
    likes: { type: Number, default: 0, min: 0 },
    note: { type: String },
    path: {
      type: {
        type: String,
        enum: Object.values(RoutePathTypeEnum),
        required: true,
      },
      coordinates: {
        type: [],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// IMAGE
const imageSchema = new Schema({
  url: { type: String },
  uploadedDate: { type: Date, default: Date.now },
});

// RESERVATION
const reservationSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bivouac: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bivouac',
    required: true,
  },
  reservedPlaces: { type: Number, required: true },
  reservationDate: { type: Date, default: Date.now },
});

// SETTING
const settingSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  darkMode: { type: Boolean, default: false },
  language: { type: String, default: 'en' },
});

// NOTIFICATION
const notificationSchema = new Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'bivouac_reservation',
        'bivouac_update',
        'route_reservation',
        'weather_alert',
      ],
      required: true,
    },
    uiType: {
      type: String,
      enum: ['info', 'success', 'alert'],
      required: true,
      default: 'info',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: {
      // flexible container: stores any structure
      type: mongoose.Schema.Types.Mixed, // allows any JSON object
      default: {},
    },
    referenceUrl: { type: String }, // where the user goes when they click
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
// this ensures fetching notifications is instant
notificationSchema.index({ recipient: 1, createdAt: -1 });

// PROPOSAL
const proposalSchema = new Schema({
  senderEmail: { type: String, required: true },
  type: { type: String, enum: Object.values(ProposalEnum), required: true },
  subjectName: { type: String, required: true },
  description: { type: String, required: true },
  locality: { type: String, required: true },
  submissionDate: { type: Date, default: Date.now },
});
// Ensure a user cannot submit duplicate proposals
proposalSchema.index(
  { senderEmail: 1, type: 1, subjectName: 1, locality: 1 },
  { unique: true }
);

/**************************************** Models ****************************************/
const User = mongoose.model<UserDocument>('User', userSchema);
const Bivouac = mongoose.model<BivouacDocument>('Bivouac', bivouacSchema);
const Route = mongoose.model<RouteDocument>('Route', routeSchema);
const Image = mongoose.model('Image', imageSchema);
const Reservation = mongoose.model('Reservation', reservationSchema);
const Setting = mongoose.model('Setting', settingSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Proposal = mongoose.model<ProposalDocument>('Proposal', proposalSchema);

/**************************************** Exports ****************************************/

export {
  Bivouac,
  Image,
  Notification,
  Proposal,
  Reservation,
  Route,
  Setting,
  User,
};
