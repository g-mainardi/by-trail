import type { Response } from 'express';
import {
  UserStatusEnum,
  UserTypeEnum,
  type AuthRequest,
} from '../types/index.js';
import { User } from '../models/models.js';

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

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
