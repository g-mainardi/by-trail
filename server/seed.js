import mongoose from "mongoose";
import fs from 'fs';
import path from 'path';

import { User, Admin, Bivacco, Trail, Image, FavBivacco, FavTrail, Reservation, Setting, Notify } from './src/models/models.js'

const MONGO_URI_LOCAL = 'mongodb://localhost:27017/by_trail'

const rawData = fs.readFileSync('./src/data/seedData.json', 'utf8');
const data = JSON.parse(rawData);

const loadData = (fileName) => {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', fileName);
        const rawData = fs.readFileSync(filePath, 'utf-8');
        console.log(`Successfully loaded ${fileName}`);
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Error loading data from ${fileName}`);
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

        const users = await User.insertMany(data.users);
        const bivaccos = await Bivacco.insertMany(data);

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();