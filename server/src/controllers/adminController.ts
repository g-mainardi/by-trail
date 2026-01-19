import type { Response } from 'express';
import {
  EXCLUDED_UPDATE_FIELDS,
  PathObj,
  RoutePathTypeEnum,
  UserStatusEnum,
  UserTypeEnum,
} from '../types/index.js';
import { AuthRequest } from '../types/server_only.js';
import { User, Bivouac, Route } from '../models/models.js';
import mongoose from 'mongoose';

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
  const userId = req.user?.id;
  const targetUserId = req.params.id;
  const { status } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }
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
  const userId = req.user?.id;
  const targetUserId = req.params.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }
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

export const updateBivouac = async (req: AuthRequest, res: Response) => {
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

export const deleteBivouac = async (req: AuthRequest, res: Response) => {
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

export const updateRoute = async (req: AuthRequest, res: Response) => {
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
        const pathObj = value as PathObj;
        if (
          !pathObj ||
          !Object.values(RoutePathTypeEnum).includes(pathObj.type)
        )
          return res.status(400).json({ error: 'Invalid path type' });
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

export const deleteRoute = async (req: AuthRequest, res: Response) => {
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
