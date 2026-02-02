import { createServer } from 'http';
import app from '@/app.js';
import connectDB from '@/config/db.js';
import { initSocket } from '@/config/socket.js';
import { initWeatherJob } from '@/jobs/weatherJob.js';

const PORT = process.env.PORT || 3000; // Default port for Express
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'; // Vite default port

// Create HTTP Server needed for Socket.io
const httpServer = createServer(app);

// Connect to Database
// todo Ideally, we start the server ONLY if DB connects.
connectDB();

// Initialize Socket.io
initSocket(httpServer, app, CLIENT_ORIGIN);

// Initialize Cron Jobs
initWeatherJob();

// Start Server
const server = httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Graceful Shutdown
const gracefulShutdown = () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
};

// Nodemon with custom configured signal
process.on('SIGTERM', gracefulShutdown);
// Docker stop
process.on('SIGINT', gracefulShutdown);
