import type { Response } from 'express';
import type { AuthRequest } from './userController.ts';
import mongoose from 'mongoose';
import { FavBivouac } from '../models/models.js';

export const fetchFavoriteBivouacs = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const favorites = await FavBivouac.find({ user: userId })
      .populate('bivouac')
      .exec();

    let favoriteBivouacs = favorites.map((fav) => fav.bivouac);
    if (favoriteBivouacs.some((fav) => fav === null)) {
      console.warn('Orphaned favorite bivouac records found for user:', userId);
      favoriteBivouacs = favoriteBivouacs.filter((bivouac) => bivouac !== null);
    }

    return res.status(200).json({ bivouacs: favoriteBivouacs });
  } catch (error) {
    console.error('Error fetching favorite bivouacs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const addFavoriteBivouac = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  console.log('Add favorite bivouac - Not implemented yet');
  return res.status(501).json({ error: 'Not implemented yet' });
};

export const removeFavoriteBivouac = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  console.log('Remove favorite bivouac - Not implemented yet');
  return res.status(501).json({ error: 'Not implemented yet' });
};
