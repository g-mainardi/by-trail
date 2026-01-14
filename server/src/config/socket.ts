import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Application } from 'express';

export const initSocket = (
  httpServer: HttpServer,
  app: Application,
  origin: string | string[]
) => {
  const io = new Server(httpServer, {
    cors: {
      origin: origin,
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  // Make 'io' accessible in controllers via req.app.get('socketio')
  app.set('socketio', io);

  io.on('connection', (socket: Socket) => {
    console.log('Socket connected: ', socket.id);

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  });

  return io;
};
