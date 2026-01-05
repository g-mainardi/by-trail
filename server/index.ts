import cors from 'cors';
import express from 'express';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.ts';
import bivouacsRoutes from './src/routes/bivouacsRoutes.ts';
import { mainRoutes } from './src/routes/mainRoutes.ts';
import userRoutes from './src/routes/userRoutes.ts';

// Environment variables setup
const PORT = process.env.PORT || 3000; // Default port for Express
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'; // Vite default port

const app = express();

// Middleware setup
app.use(express.json());

// DB connection
connectDB();

// Validate CLIENT_ORIGIN to prevent security vulnerabilities
if (CLIENT_ORIGIN === '*') {
  throw new Error(
    'CLIENT_ORIGIN cannot be a wildcard (*) when credentials are enabled'
  );
}

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

// Routes
app.use('/api', mainRoutes); // Public/Generic routes
app.use('/api/auth', authRoutes); // Auth routes (e.g., /api/auth/login)
app.use('/api/users', userRoutes); // User routes (e.g., /api/users/profile)
app.use('/api/bivouacs', bivouacsRoutes);

app.listen(PORT, () => {
  console.log(`Server listening at: http://localhost:${PORT}/`);
});
