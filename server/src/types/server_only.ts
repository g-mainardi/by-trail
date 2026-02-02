import { Proposal } from '@by-trail/shared';
import { Request } from 'express';
import { UserDocument } from '@/models/User.js';

// Constants
export const EXCLUDED_UPDATE_FIELDS = ['_id', '__v', 'createdAt', 'updatedAt'];

export interface AuthRequest extends Request {
  user?: UserDocument | null;
}

export interface UserParams {
  id: string;
}
export interface BivouacParams {
  id: string;
}

export interface RouteParams {
  id: string;
}

export interface ProposalParams {
  id: string;
}

export interface ProposalRequest extends AuthRequest {
  body: Proposal;
}
