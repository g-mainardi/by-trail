import { Request } from 'express';

export const UserStatusEnum = {
  ACTIVE: 'active',
  BANNED: 'banned',
} as const;

export const UserTypeEnum = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// Derives types automatically compile time
export type UserStatus = (typeof UserStatusEnum)[keyof typeof UserStatusEnum];
export type UserType = (typeof UserTypeEnum)[keyof typeof UserTypeEnum];

export interface UserDocument {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  type?: UserType;
  status?: UserStatus;
  password?: string;
  creationDate?: Date;
  favRegions?: string[];
  favoritesBivouacs?: Object[];
}

export interface AuthRequest extends Request {
  user?: UserDocument | null;
}
