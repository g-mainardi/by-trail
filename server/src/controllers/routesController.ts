import type { Request, Response } from "express";
import { Route } from '../models/models.js';

export const fetchRoutes = async (req: Request, res: Response) => {
    const DEFAULT_SIZE_LIMIT = 50;
    const { options, nextPage } = req.body;

    try {
        const routes = await Route.find().select('-path.coordinates').limit(DEFAULT_SIZE_LIMIT).exec();
        if (!routes || routes.length === 0) {
            return res.status(404).json({ message: 'No routes found' });
        }

        return res.status(200).json({ routes });
    } catch (error) {
        console.error('Error fetching routes:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};