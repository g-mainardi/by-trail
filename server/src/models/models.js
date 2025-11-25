const mongoose = require('mongoose');

/**************************************** Schemas ****************************************/

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    creationDate: { type: Date, default: Date.now },
    favRegions: { type: [String], default: [] }, 
    status: { type: String, enum: ['active', 'banned'], default: 'active' },
});

const adminSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    creationDate: { type: Date, default: Date.now },
});

const bivaccoSchema = new mongoose.Schema({
    name: { type: String },
    region: { type: String },
    city: { type: String },
    altitude: { type: Number },
    capacity: { type: Number },
    likes: { type: Number , default: 0, min: 0 },
    note: { type: String },
});

const trailSchema = new mongoose.Schema({
    name: { type: String },
    region: { type: String },
    city: { type: String },
    distance: { type: Number },
    difficulty: { type: String },
    ascent: { type: Number },
    descent: { type: Number },
    duration: { type: Number },
    likes: { type: Number, default: 0, min: 0 },
})

const imageSchema = new mongoose.Schema({
    url: { type: String },
    uploadedDate: { type: Date, default: Date.now },
});

const favBivaccoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bivacco: { type: mongoose.Schema.Types.ObjectId, ref: 'Bivacco' }, 
});

const favTrailSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    trail: { type: mongoose.Schema.Types.ObjectId, ref: 'Trail' },
});

const reservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bivacco: { type: mongoose.Schema.Types.ObjectId, ref: 'Bivacco' },
    reservedPlaces: { type: Number },
    reservationDate: { type: Date, default: Date.now },
});

const settingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    darkMode: { type: Boolean, default: false },
    language: { type: String, default: 'en' },
});

const notifySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    message: { type: String },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    referenceUrl: { type: String }, 
});


/**************************************** Models ****************************************/
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Bivacco = mongoose.model('Bivacco', bivaccoSchema);
const Trail = mongoose.model('Trail', trailSchema);
const Image = mongoose.model('Image', imageSchema);
const FavBivacco = mongoose.model('FavBivacco', favBivaccoSchema);
const FavTrail = mongoose.model('FavTrail', favTrailSchema);
const Reservation = mongoose.model('Reservation', reservationSchema);
const Setting = mongoose.model('Setting', settingSchema);
const Notify = mongoose.model('Notify', notifySchema);  


module.exports = { User, Admin, Bivacco, Trail, Image, FavBivacco, FavTrail, Reservation, Setting, Notify };