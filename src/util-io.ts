import { io } from './index.js';
export function ioEmit(botId: string, payload: any) {
  io.to(`bot:${botId}`).emit('status', payload);
}