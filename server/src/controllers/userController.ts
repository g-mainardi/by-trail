import type { Response } from 'express';
import { Setting, User } from '../models/models.js';
import { AuthRequest } from '../types/server_only.js';

/**
 * GET /api/users/profile
 * Retrieve full profile: User data + Settings
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    // req.user.id comes from the middleware that decodes the token
    const userId = req.user?.id;

    // 1. Fetch User (without password)
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Fetch Settings (if any)
    const settings = await Setting.findOne({ user: userId });

    // 3. Data preparation for frontend
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        favRegions: user.favRegions,
        creationDate: user.creationDate,
        type: user.type,
      },
    });
  } catch (error) {
    console.error('Error retrieving profile:', error);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

/**
 * PUT /api/users/profile
 * Update user profile and settings
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, favRegions, darkMode, language } = req.body;

    // todo No email or password updates allowed here => dedicated routes needed

    // 1. Update User if there are persistent fields
    if (name || favRegions) {
      await User.findByIdAndUpdate(userId, {
        ...(name && { name }), // Update only if 'name' is in the body
        ...(favRegions && { favRegions }),
      });
    }

    // 2. Return updated profile data
    const updatedUser = await User.findById(userId).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updatedSettings = await Setting.findOne({ user: userId });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        favRegions: updatedUser.favRegions,
      },
      settings: updatedSettings,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};
