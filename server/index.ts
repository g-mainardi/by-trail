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
const SWAGGER_ORIGIN = 'http://localhost:8080';
const whitelist = [CLIENT_ORIGIN, SWAGGER_ORIGIN];

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
            origin.includes('localhost'))
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

// Routes
app.use('/api', mainRoutes); // Public/Generic routes
app.use('/api/auth', authRoutes); // Auth routes (e.g., /api/auth/login)
app.use('/api/users', userRoutes); // User routes (e.g., /api/users/profile)
app.use('/api/bivouacs', bivouacsRoutes);

app.listen(PORT, () => {
  console.log(`Server listening at: http://localhost:${PORT}/`);
});
