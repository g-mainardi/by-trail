import { Request } from 'express';
import { User, Bivouac, Route } from './index.js';

export interface UserDocument extends User {
  password: string;
}
export interface BivouacDocument extends Bivouac {}
export interface RouteDocument extends Route {}

export interface AuthRequest extends Request {
  user?: User | null;
}

export interface AuthRequestWithPassword extends Request {
  user?: UserDocument | null;
}
