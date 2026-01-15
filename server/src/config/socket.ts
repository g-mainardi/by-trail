import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Application } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getSecret } from '../utils/secrets.js'; // reuse secret helper
import { User } from '../models/models.js'; // reuse User model

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

let io: Server;

export const initSocket = (
  httpServer: HttpServer,
  app: Application,
  origin: string | string[]
) => {
  io = new Server(httpServer, {
    cors: {
      origin: origin,
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  // this logic mirrors 'protect' middleware in authMiddleware.ts
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      // 1. Get token from the "auth" object we set in the client
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Not authorized, no token'));
      }

      // 2. Retrieve the secret (reusing existing utils)
      const JWT_SECRET = getSecret('JWT_SECRET', 'JWT_SECRET');

      // 3. Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      // 4. Check if the user actually exists
      const user = await User.findById(decoded.id).select('_id').lean();

      if (!user) {
        return next(new Error('User not found'));
      }

      // 5. Attach User ID to the socket session
      socket.userId = decoded.id;

      next();
    } catch (error) {
      console.error('Socket Auth Error:', error);
      next(new Error('Not Authorized, token failed'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId;

    if (userId) {
      console.log(`User ${userId} connected`);
      socket.join(userId);
    }

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  });

  // Make 'io' accessible in controllers via req.app.get('socketio')
  app.set('socketio', io);

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
