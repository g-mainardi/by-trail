import express from 'express';
import { User, Admin, Bivacco, Trail, Image, FavBivacco, FavTrail, Reservation, Setting, Notify } from '../models/models.js';

export const mainRoutes = express.Router();

mainRoutes.get('/', (req, res) => {
    res.send('Hello, World!');
});
