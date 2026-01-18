import type { Response } from 'express';
import { UserStatusEnum, UserTypeEnum } from '../types/index.js';
import { AuthRequest } from '../types/server_only.js';
import { User, Bivouac } from '../models/models.js';
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
      .status(201)
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

    return res.status(204).json({ message: 'User deleted successfully' });
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
  const updates = req.body;
  try {
    const bivouac = await Bivouac.findById(bivouacId).exec();
    if (!bivouac) return res.status(404).json({ error: 'Bivouac not found' });

    const success = await Bivouac.updateOne({ _id: bivouacId }, updates).exec();
    if (!success)
      return res.status(500).json({ error: 'Failed to update bivouac' });

    return res.status(201).json({
      message:
        success.modifiedCount === 0
          ? 'No changes were made to the bivouac'
          : 'Bivouac updated successfully',
    });
  } catch (error) {
    console.error('Error updating bivouac:', error);
    throw error;
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

    return res.status(204).json({ message: 'Bivouac deleted successfully' });
  } catch (error) {
    console.error('Error deleting bivouac:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
