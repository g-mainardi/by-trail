import express from 'express'
import cors from 'cors';
import connectDB from './src/config/db.js';
import { mainRoutes } from './src/routes/mainRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

// Environment variables setup
const PORT = process.env.PORT || 3000; // Default port for Express
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'; // Vite default port

const app = express();

// Middleware setup
app.use(express.json());

// DB connection
connectDB();

// Routes
app.use('/api', mainRoutes);      // Public/Generic routes
app.use('/api/auth', authRoutes); // Auth routes (e.g., /api/auth/login)
app.use('/api/users', userRoutes); // User routes (e.g., /api/users/profile)

app.use(cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
}));

app.listen(PORT, () => {
    console.log(`Server listening at: http://localhost:${PORT}/`);
});