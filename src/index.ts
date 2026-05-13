import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import {login as authLogin, validate as authValidate} from './controllers/authController';
import {user as user} from './controllers/userController';

const app = express();

app.use(express.json());
app.use(require('cors')({
    origin: ['https://macktime.thisistheip.com', 'http://localhost:8080', 'http://localhost:63343', 'file://']
}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.post('/auth/login', authLogin);
app.post('/auth/validate', authValidate);
app.get('/user', user);


const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: { origin: "*" }
});

io.use((socket, next) => {
    const apiKey = socket.handshake.auth.token;

    if (apiKey === 'key') {
        return next();
    }
    return next(new Error('Authentication failed'));
});

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('join-room', (sourceId: string) => {
        socket.join(`source_${sourceId}`);
    });

    socket.on('send-track-data', (payload) => {
        const { sourceId, trackData } = payload;

        socket.to(`source_${sourceId}`).emit('update-board', trackData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

httpServer.listen(8080);