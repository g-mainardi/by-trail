import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { getDbConfig } from './src/config/db.js';
import { getGeoJsonFromGpx } from './src/utils/seedHelpers.js';

import { Bivouac, Image, Route } from './../models/models.js';

const bivouacsImages: string[] = [
  './src/data/bivouacs/bivouac-2.jpg',
  './src/data/bivouacs/bivouac-3.jpg',
  './src/data/bivouacs/bivouac-4.jpg',
  './src/data/bivouacs/bivouac-5.jpg',
];

const routesImages: string[] = [
  './src/data/routes/route-2.jpg',
  './src/data/routes/route-3.jpg',
  './src/data/routes/route-4.jpg',
  './src/data/routes/route-5.jpg',
];

const loadData = (fileName: string) => {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', fileName);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    console.log(`Successfully loaded ${fileName}`);
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error loading data from ${fileName}:`, error);
    return [];
  }
};

const seedData = async () => {
  try {
    const { uri, type } = getDbConfig();

    if (!uri) {
      throw new Error(
        'Database URI is missing. Check your .env file or Docker secrets'
      );
    }

    console.log(
      `Target: ${type === 'ATLAS' ? 'MongoDB Atlas' : 'Local MongoDB'}`
    );

    await mongoose.connect(uri);

    // SEED IMAGES
    await Image.deleteMany({});
    for (const imagePath of bivouacsImages) {
      const imgData = fs.readFileSync(path.join(process.cwd(), imagePath));
      const newImage = new Image({
        name: path.basename(imagePath),
        img: {
          data: imgData,
          contentType: 'image/jpeg',
        },
      });
      await newImage.save();
    }

    // SEED BIVOUACS
    const bivouacsData = loadData('bivouacs.json');

    await Bivouac.deleteMany({});
    await Bivouac.insertMany(bivouacsData.bivouacs);

    // SEED ROUTES
    const routesMeta = loadData('routes.json');
    const routesToInsert = [];

    for (const meta of routesMeta.routes) {
      const geometry = getGeoJsonFromGpx(meta.gpxFile);

      if (geometry) {
        routesToInsert.push({
          ...meta,
          path: {
            type: geometry.type,
            coordinates: geometry.coordinates,
          },
        });
      }
    }

    if (routesToInsert.length > 0) {
      await Route.deleteMany({});
      await Route.insertMany(routesToInsert);
      console.log(`Seeded ${routesToInsert.length} routes.`);
    } else {
      console.log('No valid routes found to seed.');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
