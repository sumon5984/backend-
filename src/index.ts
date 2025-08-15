import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import botsRouter from './routes/bots.js';
import pairRouter from './routes/pair.js';
import { jwtVerify } from './auth.js';
import { startWorker, stopWorker } from './queues.js';

const app = express();
app.use(cors({ origin: process.env.ORIGIN?.split(',') || true, credentials: true }));
app.use(express.json());

app.get('/health', (_, res) => res.json({ ok: true }));

app.use('/api', jwtVerify);
app.use('/api/bots', botsRouter);
app.use('/api/pair', pairRouter);

const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: process.env.ORIGIN?.split(',') || true, credentials: true }
});

io.on('connection', socket => {
  socket.on('join', (roomId: string) => socket.join(roomId));
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log('API listening on', port));

// start workers in-process (you may deploy as separate worker service for scale)
void startWorker;
void stopWorker;