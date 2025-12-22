import type { Request, Response } from 'express';
import { Bivouac } from '../models/models.js';

export const fetchBivouacs = async (req: Request, res: Response) => {
  const DEFAULT_SIZE_LIMIT = 50;

  try {
    const { options, nextPage } = req.body;
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

// TODO
export const fetchMapBivouacs = async (req: Request, res: Response) => {
  const { topLeftCoords, bottomRightCoords } = req.body;
  return res.status(501).json({ message: 'Not implemented yet' });
};