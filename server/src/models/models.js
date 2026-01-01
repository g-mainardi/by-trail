import mongoose from 'mongoose';

const { Schema } = mongoose;

/**************************************** Schemas ****************************************/

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  creationDate: { type: Date, default: Date.now },
  favRegions: { type: [String], default: [] },
  status: { type: String, enum: ['active', 'banned'], default: 'active' },
  favoritesBivouacs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Bivouac',
    default: [],
  },
});

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  creationDate: { type: Date, default: Date.now },
});

const bivouacSchema = new Schema({
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
});

const trailSchema = new Schema({
  name: { type: String, required: true },
  region: { type: String, required: true },
  city: { type: String, required: true },
  distance: { type: Number, required: true },
  difficulty: { type: String, required: true },
  ascent: { type: Number, required: true },
  descent: { type: Number, required: true },
  duration: { type: Number, required: true },
  likes: { type: Number, default: 0, min: 0 },
});

const imageSchema = new Schema({
  url: { type: String },
  uploadedDate: { type: Date, default: Date.now },
});

const favBivaccoSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bivouac: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bivouac',
    required: true,
  },
});

const favTrailSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trail: { type: mongoose.Schema.Types.ObjectId, ref: 'Trail', required: true },
});

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

const settingSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  darkMode: { type: Boolean, default: false },
  language: { type: String, default: 'en' },
});

const notifySchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  referenceUrl: { type: String },
});

/**************************************** Models ****************************************/
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Bivouac = mongoose.model('Bivouac', bivouacSchema);
const Trail = mongoose.model('Trail', trailSchema);
const Image = mongoose.model('Image', imageSchema);
const FavBivacco = mongoose.model('FavBivacco', favBivaccoSchema);
const FavTrail = mongoose.model('FavTrail', favTrailSchema);
const Reservation = mongoose.model('Reservation', reservationSchema);
const Setting = mongoose.model('Setting', settingSchema);
const Notify = mongoose.model('Notify', notifySchema);

export {
  Admin,
  Bivouac,
  FavBivacco,
  FavTrail,
  Image,
  Notify,
  Reservation,
  Setting,
  Trail,
  User,
};
