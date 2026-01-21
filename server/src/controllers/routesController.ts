import type { Request, Response } from 'express';
import { Route } from 'src/models/models.js';
import { AuthRequest } from 'src/types/server_only.js';

export const fetchRoutes = async (req: AuthRequest, res: Response) => {
  const { latNw, lngNw, latSe, lngSe } = req.query;
  if (!latNw || !lngNw || !latSe || !lngSe) {
    try {
      const routes = await Route.find().exec();
      if (!routes || routes.length === 0) {
        return res.status(200).json({ routes: [] });
      }
      return res.status(200).json({ routes });
    } catch (error) {
      console.error('Error fetching routes:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  const nwLng = parseFloat(lngNw as string);
  const nwLat = parseFloat(latNw as string);
  const seLng = parseFloat(lngSe as string);
  const seLat = parseFloat(latSe as string);

  try {
    const routes = await Route.find({
      path: {
        $geoIntersects: {
          $geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [nwLng, nwLat], // Angolo NW (Inizio)
                [seLng, nwLat], // Angolo NE (Calcolato: lng di SE, lat di NW)
                [seLng, seLat], // Angolo SE
                [nwLng, seLat], // Angolo SW (Calcolato: lng di NW, lat di SE)
                [nwLng, nwLat], // Angolo NW (Chiusura del poligono)
              ],
            ],
          },
        },
      },
    }).exec();
    return res.status(200).json({ routes });
  } catch (error) {
    console.error('Error fetching map routes:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchRouteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'Route ID is required' });

  try {
    const route = await Route.findById(id).exec();
    if (!route) return res.status(404).json({ message: 'Route not found' });
    return res.status(200).json({ route });
  } catch (error) {
    console.error('Error fetching route by ID:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
