import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || '');
export const startQueue = new Queue('bot:start', { connection });
export const stopQueue  = new Queue('bot:stop', { connection });

export const startWorker = new Worker('bot:start', async (job: Job) => {
  const { botId } = job.data as { botId: string };
  const { spawnBot } = await import('./runner/spawn.js');
  await spawnBot(botId);
}, { connection });

export const stopWorker = new Worker('bot:stop', async (job: Job) => {
  const { botId } = job.data as { botId: string };
  const { stopBot } = await import('./runner/spawn.js');
  await stopBot(botId);
}, { connection });