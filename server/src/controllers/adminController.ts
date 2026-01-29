import type { Request, Response } from 'express';
import {
  AuthRequest,
  BivouacParams,
  EXCLUDED_UPDATE_FIELDS,
  ProposalParams,
  RouteParams,
} from '../types/server_only.js';
import { UserModel as User, UserDocument } from '../models/User.js';
import mongoose from 'mongoose';
import {
  PathObj,
  ProposalWithEmail,
  RoutePathType,
  RoutePathTypeEnum,
  UserStatusEnum,
  UserTypeEnum,
} from '@by-trail/shared';
import { BivouacModel as Bivouac } from '../models/Bivouac.js';
import { RouteModel as Route } from '../models/Route.js';
import { ProposalModel as Proposal } from '../models/Proposal.js';

export const fetchUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().exec();

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id.toString();
  const targetUserId = req.params.id as string;
  const { status } = req.body;

  if (!status || !Object.values(UserStatusEnum).includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  if (userId === targetUserId) {
    return res
      .status(400)
      .json({ error: 'Cannot change status of your own account' });
  }

  try {
    const user = await User.findById(targetUserId).exec();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.type === UserTypeEnum.ADMIN) {
      return res
        .status(403)
        .json({ error: 'Cannot change status of an admin account' });
    }

    user.status = status;
    await user.save();

    return res
      .status(200)
      .json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id.toString();
  const targetUserId = req.params.id as string;

  if (userId === targetUserId) {
    return res.status(400).json({
      error:
        'Cannot delete your own account, use the appropriate settings form instead',
    });
  }

  try {
    const user = await User.findById(targetUserId).exec();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.type === UserTypeEnum.ADMIN) {
      return res.status(403).json({ error: 'Cannot delete an admin account' });
    }
    const deletionResult = await User.deleteOne({ _id: targetUserId }).exec();
    if (deletionResult.deletedCount === 0)
      return res.status(404).json({ error: 'User not found' });

    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBivouac = async (
  req: Request<BivouacParams>,
  res: Response
) => {
  const bivouacId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(bivouacId)) {
    return res.status(400).json({ error: 'Invalid bivouac ID format' });
  }
  try {
    const bivouac = await Bivouac.findById(bivouacId).exec();
    if (!bivouac) return res.status(404).json({ error: 'Bivouac not found' });
    const requestUpdates = req.body as Record<string, unknown>;
    const allowedUpdatePaths = Object.keys(Bivouac.schema.paths).filter(
      (path) => !EXCLUDED_UPDATE_FIELDS.includes(path)
    );
    const sanitizedUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(requestUpdates)) {
      if (allowedUpdatePaths.includes(key)) {
        sanitizedUpdates[key] = value;
      }
    }
    if (Object.keys(sanitizedUpdates).length === 0) {
      return res
        .status(400)
        .json({ error: 'No valid fields provided for bivouac update' });
    }
    const result = await Bivouac.updateOne(
      { _id: bivouacId },
      { $set: sanitizedUpdates },
      { runValidators: true }
    ).exec();

    return res.status(200).json({
      message:
        result.modifiedCount === 0
          ? 'No changes were made to the bivouac'
          : 'Bivouac updated successfully',
    });
  } catch (error) {
    console.error('Error updating bivouac:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteBivouac = async (
  req: Request<BivouacParams>,
  res: Response
) => {
  const bivouacId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(bivouacId)) {
    return res.status(400).json({ error: 'Invalid bivouac ID format' });
  }

  try {
    const deletionResult = await Bivouac.deleteOne({ _id: bivouacId }).exec();
    if (deletionResult.deletedCount === 0)
      return res.status(404).json({ error: 'Bivouac not found' });

    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting bivouac:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateRoute = async (req: Request<RouteParams>, res: Response) => {
  const routeId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(routeId))
    return res.status(400).json({ error: 'Invalid route ID format' });

  try {
    const route = await Route.findById(routeId).exec();
    if (!route) return res.status(404).json({ error: 'Route not found' });
    const requestUpdates = req.body as Record<string, unknown>;
    const allowedUpdatePaths = Object.keys(Route.schema.paths).filter(
      (path) => !EXCLUDED_UPDATE_FIELDS.includes(path)
    );
    const sanitizedUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(requestUpdates)) {
      if (key === 'region' && Array.isArray(value)) {
        // Ensure at least one region is provided
        if (value.length === 0) {
          return res
            .status(400)
            .json({ error: 'A route must have at least one region.' });
        }
        sanitizedUpdates[key] = value;
      } else if (key === 'path') {
        // Validate that value is a non-null object with a valid type before casting
        if (
          !value ||
          typeof value !== 'object' ||
          Array.isArray(value) ||
          !('type' in (value as Record<string, unknown>)) ||
          !Object.values(RoutePathTypeEnum).includes(
            (value as { type: RoutePathType }).type
          )
        ) {
          return res.status(400).json({ error: 'Invalid path type' });
        }
        const pathObj = value as PathObj;
        const pathType = pathObj.type;
        // Do not allow updating coordinates
        sanitizedUpdates['path'] = {
          type: pathType,
          coordinates: route.path?.coordinates || [],
        };
      } else if (allowedUpdatePaths.includes(key)) {
        sanitizedUpdates[key] = value;
      }
    }
    if (Object.keys(sanitizedUpdates).length === 0) {
      return res
        .status(400)
        .json({ error: 'No valid fields provided for route update' });
    }
    const result = await Route.updateOne(
      { _id: routeId },
      { $set: sanitizedUpdates },
      { runValidators: true }
    ).exec();

    return res.status(200).json({
      message:
        result.modifiedCount === 0
          ? 'No changes were made to the route'
          : 'Route updated successfully',
    });
  } catch (error) {
    console.error('Error updating route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteRoute = async (req: Request<RouteParams>, res: Response) => {
  const routeId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(routeId)) {
    return res.status(400).json({ error: 'Invalid route ID format' });
  }

  try {
    const deletionResult = await Route.deleteOne({ _id: routeId }).exec();
    if (deletionResult.deletedCount === 0)
      return res.status(404).json({ error: 'Route not found' });

    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchProposals = async (req: AuthRequest, res: Response) => {
  try {
    // Fetch proposals and populate only the necessary sender fields (email)
    // Using lean() converts Mongoose Documents into plain JavaScript objects immediately
    const proposals = await Proposal.find()
      .populate('sender', 'email')
      .lean()
      .exec();

    const proposalsWithEmail: ProposalWithEmail[] = proposals.map(
      (proposal) => {
        // Because of lean(), we can treat 'sender' as a plain object or check if it exists
        // Check if sender is populated and has an email (handle deleted users edge case)
        // Exclude the sender field from the serialized response to avoid leaking internal IDs
        const { sender: sender, _id: _id, ...proposalWithoutSender } = proposal;
        return {
          ...proposalWithoutSender,
          _id: _id?.toString(),
          senderEmail: (sender as unknown as UserDocument | null)?.email,
        } as ProposalWithEmail;
      }
    );

    return res.status(200).json({ proposals: proposalsWithEmail });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProposal = async (
  req: Request<ProposalParams>,
  res: Response
) => {
  const proposalId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(proposalId)) {
    return res.status(400).json({ error: 'Invalid proposal ID format' });
  }

  try {
    const deletionResult = await Proposal.deleteOne({ _id: proposalId }).exec();
    if (deletionResult.deletedCount === 0)
      return res.status(404).json({ error: 'Proposal not found' });

    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
