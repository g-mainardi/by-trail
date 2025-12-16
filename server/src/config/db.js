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

    const MAX_RETRIES = 10;
    const INITIAL_DELAY_MS = 5000;
    const MAX_DELAY_MS = 60000; // 1 minute

    const tryConnect = async (retries = 0, delay = INITIAL_DELAY_MS) => {
        try {
            await mongoose.connect(uri);
            console.log("MongoDB Connected successfully!");
        } catch (error) {
            console.error(`MongoDB connection error: ${error.message}`);
            if (retries < MAX_RETRIES) {
                const nextDelay = Math.min(delay * 2, MAX_DELAY_MS);
                console.log(`Retrying in ${delay / 1000} seconds... (Attempt ${retries + 1} of ${MAX_RETRIES})`);
                setTimeout(() => tryConnect(retries + 1, nextDelay), delay);
            } else {
                console.error("Maximum retry attempts reached. Could not connect to MongoDB.");
                process.exit(1);
            }
        }
    };

    await tryConnect();
};

export default connectDB;