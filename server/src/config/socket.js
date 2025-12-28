import { Server } from 'socket.io';

export const initSocket = (httpServer, app, origin) => {
    const io = new Server(httpServer, {
        cors: {
            origin: origin,
            credentials: true,
            methods: ['GET', 'POST']
        }
    });

    // Make 'io' accessible in your Controllers via req.app.get('socketio')
    // app.set('socketio', io)

    io.on('connection', (socket) => {
        console.log('Socket connected: ', socket.id);

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    });
};