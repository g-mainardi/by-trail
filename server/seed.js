import fs from 'fs';
import mongoose from "mongoose";
import path from 'path';

import { Bivacco, } from './src/models/models.js';

const getMongoURI = () => {
    
    console.log("USE_ATLAS is:", process.env.USE_ATLAS);
    const withAtlas = process.env.USE_ATLAS === "true";
    const secretPath = process.env.MONGO_URI_FILE;

    if (withAtlas && secretPath && fs.existsSync(secretPath)) {
        console.log("Target: MongoDB Atlas");
        return fs.readFileSync(secretPath, 'utf8').trim();
    }
    
    console.log("Target: Local MongoDB");
    return process.env.MONGO_URI_LOCAL;
}

const loadData = (fileName) => {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', fileName);
        const rawData = fs.readFileSync(filePath, 'utf-8');
        console.log(`Successfully loaded ${fileName}`);
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Error loading data from ${fileName}:`, error);
        return [];
    }
}

const seedData = async () => {
    try {
        const uri = getMongoURI();
        await mongoose.connect(uri);

        const bivaccosData = loadData('bivaccos.json');

        if (!bivaccosData.bivaccos) {
            throw new Error("JSON files missing 'bivaccos' keys.");
        }

        await Bivacco.deleteMany({});
        await Bivacco.insertMany(bivaccosData.bivaccos);

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();