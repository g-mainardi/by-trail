import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from '@/routes/authRoutes.js';
import bivouacsRoutes from '@/routes/bivouacsRoutes.js';
import routesRoutes from '@/routes/routesRoutes.js';
import proposalRoutes from '@/routes/proposalRoutes.js';
import adminRoutes from '@/routes/adminRoutes.js';
import userRoutes from '@/routes/userRoutes.js';
import notificationsRoutes from '@/routes/notificationsRoutes.js';
import testRoutes from '@/routes/testRoutes.js';

// Initialize Express App
const app = express();

// --- Configuration ---
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'; // Vite default port
const SWAGGER_ORIGIN =
  process.env.SWAGGER_ORIGIN ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : undefined);

// --- Middleware: CORS ---
const whitelist = [CLIENT_ORIGIN];
if (SWAGGER_ORIGIN) whitelist.push(SWAGGER_ORIGIN);

app.use(
  cors({
    origin: function (origin, callback) {
      // To allow server-to-server requests and tools like Postman/Curl (that don't send Origin header)
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Allow localhost in development mode
        if (
          process.env.NODE_ENV === 'development' &&
          origin &&
          (origin.startsWith('vscode-webview://') ||
            origin.startsWith('http://localhost:') ||
            origin.startsWith('https://localhost:'))
        ) {
          return callback(null, true);
        }

        console.log('Blocked by CORS:', origin); // useful for debugging
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// --- Middleware: Body Parser ---
app.use(express.json());

// --- Routes ---
// Health Check / Welcome
app.get('/api', (_: Request, res: Response) => {
  res.send('Welcome to the By Trail API');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bivouacs', bivouacsRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/test', testRoutes);

export default app;
