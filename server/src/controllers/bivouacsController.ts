import type { Request, Response } from 'express';
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
