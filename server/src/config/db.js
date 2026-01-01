import mongoose from 'mongoose';
import fs from 'fs';

// Helper to read the secret
export const getDbConfig = () => {
  console.log('USE_ATLAS is:', process.env.USE_ATLAS);
  const withAtlas = process.env.USE_ATLAS === 'true';
  const secretPath = process.env.MONGO_URI_FILE;

  // Case 1: Docker with Secrets (Atlas)
  if (withAtlas && secretPath && fs.existsSync(secretPath)) {
    return {
      uri: fs.readFileSync(secretPath, 'utf8').trim(),
      type: 'ATLAS',
    };
  }

  // Case 2: Fallback (Use Local DB)
  return {
    uri: process.env.MONGO_URI_LOCAL,
    type: 'LOCAL',
  };
};

const connectDB = async () => {
  const { uri, type } = getDbConfig();

  if (type === 'ATLAS') {
    console.log('Loading Atlas URI from Docker Secret...');
  } else {
    console.log('No Secret found (or USE_ATLAS=false), using local URI...');
  }

  const MAX_RETRIES = 10;
  const INITIAL_DELAY_MS = 5000;
  const MAX_DELAY_MS = 60000; // 1 minute

  const tryConnect = async (retries = 0, delay = INITIAL_DELAY_MS) => {
    try {
      await mongoose.connect(uri);
      console.log('MongoDB Connected successfully!');
    } catch (error) {
      console.error(`MongoDB connection error: ${error.message}`);
      if (retries < MAX_RETRIES) {
        const nextDelay = Math.min(delay * 2, MAX_DELAY_MS);
        console.log(
          `Retrying in ${delay / 1000} seconds... (Attempt ${retries + 1} of ${MAX_RETRIES})`
        );
        setTimeout(() => tryConnect(retries + 1, nextDelay), delay);
      } else {
        console.error(
          'Maximum retry attempts reached. Could not connect to MongoDB.'
        );
        process.exit(1);
      }
    }
  };

  await tryConnect();
};

export default connectDB;
