import mongoose from "mongoose";
import { User, Admin, Bivacco, Trail, Image, FavBivacco, FavTrail, Reservation, Setting, Notify } from './src/models/models.js'

const MONGO_URI_LOCAL = 'mongodb://localhost:27017/by_trail'

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI_LOCAL); // Look for explanation
        
        await User.deleteMany({});
        await Bivacco.deleteMany({});
        await Trail.deleteMany({});

        const users = await User.insertMany([
            { name: 'Jeff Bezossss', email: 'jeff_bezos@gmail.com' },
            { name: 'Mark Zuckenberg', email: 'markinho_brazil@yahoo.com' }
        ]);

        const bivaccos = await Bivacco.insertMany([
            { 
                name: 'Bivacco Bedin',
                region: 'Veneto',
                mountainRange: 'Dolomiti',
                altitude: 2210,
                capacity: 9,
            },
            {
                name: 'Bivacco Vigolana',
                region: 'Trentino - Alto Adige',
                mountainRange: 'Prealpi Venete',
                altitude: '2030',
                capacity: '8',
            },
        ]);

        process.exit();

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();