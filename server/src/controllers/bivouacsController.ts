import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BivouacModel as Bivouac } from '@/models/Bivouac.js';
import type { AuthRequest, BivouacParams } from '@/types/server_only.js';

export const fetchBivouacs = async (req: AuthRequest, res: Response) => {
  const { latNw, lngNw, latSe, lngSe } = req.query;
  if (!latNw || !lngNw || !latSe || !lngSe) {
    try {
      const bivouacs = await Bivouac.find().exec();
      if (!bivouacs || bivouacs.length === 0) {
        return res.status(200).json({ bivouacs: [] });
      }
      return res.status(200).json({ bivouacs });
    } catch (error) {
      console.error('Error fetching bivouacs:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  const northWest = {
    lat: parseFloat(latNw as string),
    lng: parseFloat(lngNw as string),
  };

  const southEast = {
    lat: parseFloat(latSe as string),
    lng: parseFloat(lngSe as string),
  };

  try {
    const bivouacs = await Bivouac.find({
      'coords.latitude': {
        $gte: southEast.lat,
        $lte: northWest.lat,
      },
      'coords.longitude': {
        $gte: northWest.lng,
        $lte: southEast.lng,
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

export const fetchBivouacById = async (
  req: Request<BivouacParams>,
  res: Response
) => {
  const { id } = req.params;
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
