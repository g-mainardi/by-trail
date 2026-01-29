import type { Response } from 'express';
import mongoose from 'mongoose';
import console from 'node:console';
import { BivouacModel as Bivouac } from '../models/Bivouac.js';
import { RouteModel as Route } from '../models/Route.js';
import { UserModel as User } from '../models/User.js';
import type { AuthRequest } from '../types/server_only.js';

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

    return res.status(200).json({ bivouacs: favorites });
  } catch (error) {
    console.error('Error fetching favorite bivouacs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const addFavoriteBivouac = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const bivouacId = req.body.id;

  if (!bivouacId || !mongoose.Types.ObjectId.isValid(bivouacId)) {
    return res.status(400).json({ error: 'Invalid or missing bivouac ID' });
  }
  const favoritesBivouacs = req.user?.favoritesBivouacs || [];

  if (favoritesBivouacs.includes(bivouacId)) {
    return res.status(409).json({ error: 'Bivouac already in favorites' });
  }
  try {
    const exists = await Bivouac.findById(bivouacId);
    if (!exists) {
      return res.status(404).json({ error: 'Bivouac not found' });
    }
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
  const userId = req.user?._id;
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

export const fetchFavoriteRoutes = async (req: AuthRequest, res: Response) => {
  try {
    const favoriteRoutesIds = req.user?.favoritesRoutes || [];
    if (!favoriteRoutesIds || favoriteRoutesIds.length === 0) {
      return res.status(200).json({ routes: [] });
    }
    const favorites = await Route.find({
      _id: { $in: favoriteRoutesIds },
    });

    return res.status(200).json({ routes: favorites });
  } catch (error) {
    console.error('Error fetching favorite routes:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const addFavoriteRoute = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const routeId = req.body.id;

  if (!routeId || !mongoose.Types.ObjectId.isValid(routeId)) {
    return res.status(400).json({ error: 'Invalid or missing route ID' });
  }
  const favoritesRoutes = req.user?.favoritesRoutes || [];

  if (favoritesRoutes.includes(routeId)) {
    return res.status(409).json({ error: 'Route already in favorites' });
  }
  try {
    const exists = await Route.findById(routeId);
    if (!exists) {
      return res.status(404).json({ error: 'Route not found' });
    }
    const success = await User.findByIdAndUpdate(userId, {
      $push: { favoritesRoutes: routeId },
    });
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(201).json({ message: 'Route added to favorites' });
  } catch (error) {
    console.error('Error adding favorite route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeFavoriteRoute = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const routeId = req.body.id;

  if (!routeId || !mongoose.Types.ObjectId.isValid(routeId)) {
    return res.status(400).json({ error: 'Invalid or missing route ID' });
  }
  const favoritesRoutes = req.user?.favoritesRoutes || [];

  if (!favoritesRoutes.includes(routeId)) {
    return res.status(404).json({ error: 'Route not in favorites' });
  }

  try {
    const deletedFavorite = await User.findByIdAndUpdate(userId, {
      $pull: { favoritesRoutes: routeId },
    });

    if (!deletedFavorite) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Error removing favorite route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
