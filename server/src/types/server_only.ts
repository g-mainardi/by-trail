import { Request } from 'express';
import { User, Bivouac, Route, Proposal } from './index.js';

// Constants
export const EXCLUDED_UPDATE_FIELDS = ['_id', '__v', 'createdAt', 'updatedAt'];

export interface UserDocument extends User {
  password: string;
}
export interface BivouacDocument extends Bivouac {}
export interface RouteDocument extends Route {}
export interface ProposalDocument extends Proposal {
  sender: string;
}

export interface AuthRequest extends Request {
  user?: User | null;
}

export interface AuthRequestWithPassword extends Request {
  user?: UserDocument | null;
}

export interface ProposalRequest extends AuthRequest {
  body: Proposal;
}
