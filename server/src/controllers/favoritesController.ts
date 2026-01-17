import type { Response } from 'express';
import type { AuthRequest } from '../types/index.js';
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
  const bivouacId = req.body.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  if (!bivouacId || !mongoose.Types.ObjectId.isValid(bivouacId)) {
    return res.status(400).json({ error: 'Invalid or missing bivouac ID' });
  }

  try {
    const existingFavorite = await FavBivouac.findOne({
      user: userId,
      bivouac: bivouacId,
    }).exec();

    if (existingFavorite) {
      return res.status(409).json({ error: 'Bivouac already in favorites' });
    }

    const newFavorite = new FavBivouac({
      user: userId,
      bivouac: bivouacId,
    });
    await newFavorite.save();

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

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  if (!bivouacId || !mongoose.Types.ObjectId.isValid(bivouacId)) {
    return res.status(400).json({ error: 'Invalid or missing bivouac ID' });
  }

  try {
    const deletedFavorite = await FavBivouac.findOneAndDelete({
      user: userId,
      bivouac: bivouacId,
    }).exec();

    if (!deletedFavorite) {
      return res.status(404).json({ error: 'Favorite bivouac not found' });
    }

    return res.status(200).json({ message: 'Bivouac removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite bivouac:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
