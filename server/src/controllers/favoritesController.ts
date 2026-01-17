import type { Response } from 'express';
import type { AuthRequest } from '../types/index.js';
import mongoose from 'mongoose';
import { User, Bivouac } from '../models/models.js';

export const fetchFavoriteBivouacs = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const favoriteBivouacsIds = req.user?.favoritesBivouacs || [];
    if (!favoriteBivouacsIds || favoriteBivouacsIds.length === 0) {
      return res.status(200).json({ bivouacs: [] });
    }
    const favorites = await Bivouac.find({
      _id: { $in: favoriteBivouacsIds },
    });
    if (!favorites) {
      console.warn('Invalid bivouac IDs in user favorites');
      return res.status(200).json({ bivouacs: [] });
    }

    return res.status(200).json({ bivouacs: favorites });
  } catch (error) {
    console.error('Error fetching favorite bivouacs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const addFavoriteBivouac = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const bivouacId = req.body.id;

  if (!bivouacId || !mongoose.Types.ObjectId.isValid(bivouacId)) {
    return res.status(400).json({ error: 'Invalid or missing bivouac ID' });
  }
  const favoritesBivouacs = req.user?.favoritesBivouacs || [];

  if (favoritesBivouacs.includes(bivouacId)) {
    return res.status(409).json({ error: 'Bivouac already in favorites' });
  }
  try {
    const success = await User.findByIdAndUpdate(userId, {
      $push: { favoritesBivouacs: bivouacId },
    });
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(201).json({ message: 'Bivouac added to favorites' });
  } catch (error) {
    console.error('Error adding favorite bivouac:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeFavoriteBivouac = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?.id;
  const bivouacId = req.body.id;

  if (!bivouacId || !mongoose.Types.ObjectId.isValid(bivouacId)) {
    return res.status(400).json({ error: 'Invalid or missing bivouac ID' });
  }
  const favoritesBivouacs = req.user?.favoritesBivouacs || [];

  if (!favoritesBivouacs.includes(bivouacId)) {
    return res.status(404).json({ error: 'Bivouac not in favorites' });
  }

  try {
    const deletedFavorite = await User.findByIdAndUpdate(userId, {
      $pull: { favoritesBivouacs: bivouacId },
    });

    if (!deletedFavorite) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Error removing favorite bivouac:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
