import fs from 'fs';
import mongoose from "mongoose";
import path from 'path';

import { Bivacco, User } from './src/models/models.js';

const MONGO_URI_LOCAL = 'mongodb://localhost:27017/by_trail'

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
        await mongoose.connect(MONGO_URI_LOCAL);

        const usersData = loadData('users.json');
        const bivaccosData = loadData('bivaccos.json');

        await User.deleteMany({});
        await Bivacco.deleteMany({});

        const users = await User.insertMany(usersData.users);
        const bivaccos = await Bivacco.insertMany(bivaccosData.bivaccos);

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();