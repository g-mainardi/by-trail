import express from 'express'
import connectDB from './src/config/db.js';
import { mainRoutes } from './src/routes/mainRoutes.js';

const PORT = 3000;
const app = express();

// Middleware
app.use(express.json());

// 1. connnect to DB
connectDB();

// 2. Use Routes    
app.use('/', mainRoutes);

app.listen(PORT, () => {
    console.log(`Server listening at: http://localhost:${PORT}/`);
});