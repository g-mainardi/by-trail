import mongoose from 'mongoose';
import fs from 'fs';

// Helper to read the secret
const getMongoURI = () => {
    const withAtlas = process.env.USE_ATLAS === "true";
    const secretPath = process.env.MONGO_URI_FILE;

    // Case 1: Docker with Secrets (Atlas)
    if (withAtlas && secretPath && fs.existsSync(secretPath)) {
        console.log("Loading Atlas URI from Docker Secret...");
        return fs.readFileSync(secretPath, 'utf8').trim();
    }

    // Case 2: Fallback (Use Local DB)
    console.log("No Secret found (or USE_ATLAS=false), using local URI...");
    return process.env.MONGO_URI_LOCAL; 
};

const connectDB = async () => {
    const uri = getMongoURI();

    const tryConnect = async () => {
        try {
            await mongoose.connect(uri);
            console.log("MongoDB Connected successfully!");
        } catch (error) {
            console.error(`MongoDB connection error: ${error.message}`);
            console.log("Retrying in 5 seconds...");
            setTimeout(tryConnect, 5000);
        }
    };

    await tryConnect();
};

export default connectDB;