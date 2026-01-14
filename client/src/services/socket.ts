import { io, type Socket } from 'socket.io-client';

const URL = "http://localhost:3000";

export const socket: Socket = io(URL, {
    autoConnect: false, // connect manually when the app start
    withCredentials: true
});

socket.onAny((event, ...args) => {
    console.log('Event received:', event, args);
});