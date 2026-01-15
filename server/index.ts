import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { initSocket } from './src/config/socket.js';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import bivouacsRoutes from './src/routes/bivouacsRoutes.js';
import routesRoutes from './src/routes/routesRoutes.js';
import proposalRoutes from './src/routes/proposalRoutes.js';
import { mainRoutes } from './src/routes/mainRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import notificationsRoutes from './src/routes/notificationsRoutes.js';

// Environment variables setup
const PORT = process.env.PORT || 3000; // Default port for Express
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'; // Vite default port
const SWAGGER_ORIGIN =
  process.env.SWAGGER_ORIGIN ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : undefined);
const whitelist = [CLIENT_ORIGIN];

if (SWAGGER_ORIGIN) {
  whitelist.push(SWAGGER_ORIGIN);
}
const app = express();

const httpServer = createServer(app);

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

initSocket(httpServer, app, CLIENT_ORIGIN);

// Routes
app.use('/api', mainRoutes); // Public/Generic routes
app.use('/api/auth', authRoutes); // Auth routes (e.g., /api/auth/login)
app.use('/api/users', userRoutes); // User routes (e.g., /api/users/profile)
app.use('/api/bivouacs', bivouacsRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/proposal', proposalRoutes);
app.use('/api/notifications', notificationsRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server listening at: http://localhost:${PORT}/`);
});
