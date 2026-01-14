import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { getDbConfig } from './src/config/db.js';
import { getGeoJsonFromGpx } from './src/utils/seedHelpers.js';

import { Bivouac, Route } from './src/models/models.js';

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

    console.log(
      `Target: ${type === 'ATLAS' ? 'MongoDB Atlas' : 'Local MongoDB'}`
    );

    await mongoose.connect(uri);

    // SEED BIVOUACS
    const bivouacsData = loadData('bivaccos.json');

    await Bivouac.deleteMany({});
    await Bivouac.insertMany(bivouacsData.bivouacs);

    // SEED ROUTES
    const routesMeta = loadData('routes_meta.json');
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
