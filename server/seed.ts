import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { getDbConfig } from './src/config/db.js';

import { Bivouac } from './src/models/models.js';

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

    if (type === 'ATLAS') {
      console.log('Target: MongoDB Atlas');
    } else {
      console.log('Target: Local MongoDB');
    }

    if (!uri) {
      throw new Error('Database URI is not defined');
    }

    await mongoose.connect(uri);

    const bivouacsData = loadData('bivaccos.json');

    if (!bivouacsData.bivouacs) {
      throw new Error("JSON files missing 'bivouacs' keys.");
    }

    await Bivouac.deleteMany({});
    await Bivouac.insertMany(bivouacsData.bivouacs);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
