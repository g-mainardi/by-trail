import type { Request, Response } from 'express';
import type { AuthRequest } from './userController.ts';
import mongoose from 'mongoose';
import { Bivouac } from '../models/models.ts';

export const fetchBivouacs = async (req: Request, res: Response) => {
  const DEFAULT_SIZE_LIMIT = 50;
  // TODO: implement options and pagination
  const { options, nextPage } = req.body;

  try {
    const bivouacs = await Bivouac.find().limit(DEFAULT_SIZE_LIMIT).exec();
    if (!bivouacs || bivouacs.length === 0) {
      return res.status(404).json({ message: 'No bivouacs found' });
    }
    return res.status(200).json({ bivouacs });
  } catch (error) {
    console.error('Error fetching bivouacs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchMapBivouacs = async (req: Request, res: Response) => {
  const { topLeftCoords, bottomRightCoords } = req.body || {};

  if (
    !topLeftCoords ||
    !bottomRightCoords ||
    typeof topLeftCoords.lat !== 'number' ||
    typeof topLeftCoords.lng !== 'number' ||
    typeof bottomRightCoords.lat !== 'number' ||
    typeof bottomRightCoords.lng !== 'number'
  ) {
    return res.status(400).json({
      error:
        'Invalid or missing coordinates. Expected topLeftCoords and bottomRightCoords with numeric lat and lng.',
    });
  }
  try {
    const bivouacs = await Bivouac.find({
      'coords.latitude': {
        $gte: bottomRightCoords.lat,
        $lte: topLeftCoords.lat,
      },
      'coords.longitude': {
        $gte: topLeftCoords.lng,
        $lte: bottomRightCoords.lng,
      },
    }).exec();
    if (!bivouacs || bivouacs.length === 0) {
      return res.status(200).json({ bivouacs: [] });
    }
    return res.status(200).json({ bivouacs });
  } catch (error) {
    console.error('Error fetching map bivouacs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchBivouacById = async (req: Request, res: Response) => {
  const bivouacId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(bivouacId)) {
    return res.status(400).json({ error: 'Invalid bivouac ID format' });
  }

  try {
    const bivouac = await Bivouac.findById(bivouacId).exec();
    if (!bivouac) {
      return res.status(404).json({ message: 'Bivouac not found' });
    }
    return res.status(200).json({ bivouac });
  } catch (error) {
    console.error('Error fetching bivouac by ID:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

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
    const favorites = await mongoose
      .model('FavBivouac')
      .find({ user: userId })
      .populate('bivouac')
      .exec();

    const favoriteBivouacs = favorites.map(
      (fav: any) => fav.bivouac as typeof Bivouac
    );
    return res.status(200).json({ bivouacs: favoriteBivouacs || [] });
  } catch (error) {
    console.error('Error fetching favorite bivouacs:', error);
    return res.status(500).json({ error: `Internal server error: ${error}` });
  }
};
