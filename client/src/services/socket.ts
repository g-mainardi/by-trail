import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // connect manually when the app start
  withCredentials: true,
});

socket.onAny((event, ...args) => {
  console.log('Event received:', event, args);
});
