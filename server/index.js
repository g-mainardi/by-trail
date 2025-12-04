import express from 'express'
import connectDB from './src/config/db.js';
import { mainRoutes } from './src/routes/mainRoutes.js';
import cors from 'cors';

const PORT = 3000;
const app = express();

// Middleware
app.use(express.json());

// 1. connnect to DB
connectDB();

// 2. Use Routes    
app.use('/api', mainRoutes);

app.use(cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true,
}));

app.listen(PORT, () => {
    console.log(`Server listening at: http://localhost:${PORT}/`);
});