import mongoose, { Schema, Document } from 'mongoose';
import {
  User,
  UserStatusEnum,
  UserTypeEnum,
  RegionsEnum,
} from '@by-trail/shared';

// Extend the Shared Type for Server-Only logic (Password)
export interface UserDocument
  extends
    Omit<User, '_id' | 'favoritesBivouacs' | 'favoritesRoutes'>,
    Document {
  password: string;
  // We override these to clarify they are ObjectIds in the Mongoose Document.
  favoritesBivouacs: mongoose.Types.ObjectId[];
  favoritesRoutes: mongoose.Types.ObjectId[];
}

// Define Mongoose Schema
// The generic <UserDocument> ensures TS checks this definition against the interface.
const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Server only!
  creationDate: { type: Date, default: Date.now },
  favRegions: [{ type: String, enum: Object.values(RegionsEnum) }],
  status: {
    type: String,
    enum: Object.values(UserStatusEnum),
    default: UserStatusEnum.ACTIVE,
  },
  type: {
    type: String,
    enum: Object.values(UserTypeEnum),
    default: UserTypeEnum.USER,
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
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
