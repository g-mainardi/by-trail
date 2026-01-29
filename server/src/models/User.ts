import mongoose, { Schema, Document } from 'mongoose';
import {
  User,
  UserStatusEnum,
  UserTypeEnum,
  RegionsEnum,
  UserZodSchema,
} from '@by-trail/shared';

// 1. Extend the Shared Type for Server-Only logic (Password)
// We create a server-side Zod schema extending the base one if we want validation,
// or just interface extension if it's purely for Mongoose.
export interface UserDocument
  extends
    Omit<User, '_id' | 'favoritesBivouacs' | 'favoritesRoutes'>,
    Document {
  password: string;
  // We override these to clarify they are ObjectIds in the Mongoose Document,
  // though string is often compatible in latest Mongoose typings.
  favoritesBivouacs: mongoose.Types.ObjectId[];
  favoritesRoutes: mongoose.Types.ObjectId[];
}

// 2. Define Mongoose Schema
// The generic <UserDocument> ensures TS checks this definition against the interface.
const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Server only!
  creationDate: { type: Date, default: Date.now },

  // Using Object.values from the shared consts guarantees sync
  favRegions: [{ type: String, enum: Object.values(RegionsEnum) }],

  status: {
    type: String,
    enum: Object.values(UserStatusEnum), // Synced with Zod enums
    default: UserStatusEnum.ACTIVE,
  },

  type: {
    type: String,
    enum: Object.values(UserTypeEnum),
    default: UserTypeEnum.USER,
  },

  // References
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
});

// 3. Add a pre-save hook to validate using Zod?
// Usually overkill if you validate at the API Controller level (z.parse(req.body)),
// but if you want paranoia-level safety:
userSchema.pre('validate', function (next) {
  const validation = UserZodSchema.safeParse(this.toObject());
  if (!validation.success) return next(new Error(validation.error.message));
  next();
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
