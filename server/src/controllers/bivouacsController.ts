import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Bivouac } from '../models/models.js';
import type { AuthRequest } from '../types/server_only.js';

export const fetchBivouacs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const bivouacs = await Bivouac.find().exec();
    if (!bivouacs || bivouacs.length === 0) {
      return res.status(200).json({ bivouacs: [] });
    }
    return res.status(200).json({ bivouacs });
  } catch (error) {}
};

export const fetchMapBivouacs = async (req: AuthRequest, res: Response) => {
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
  const id = req.query.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid bivouac ID format' });
  }

  try {
    const bivouac = await Bivouac.findById(id).exec();
    if (!bivouac) {
      return res.status(404).json({ message: 'Bivouac not found' });
    }
    return res.status(200).json({ bivouac });
  } catch (error) {
    console.error('Error fetching bivouac by ID:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
