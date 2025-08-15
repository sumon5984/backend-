import { Router } from 'express';
import { prisma } from '../prisma.js';
import { startQueue, stopQueue } from '../queues.js';

const r = Router();

r.get('/', async (req, res) => {
  const userId = (req as any).user.id;
  const bots = await prisma.bot.findMany({ where: { userId } });
  res.json(bots);
});

r.post('/:id/start', async (req, res) => {
  const { id } = req.params;
  await startQueue.add('start', { botId: id }, { jobId: id, removeOnComplete: true, removeOnFail: true });
  res.json({ ok: true });
});

r.post('/:id/stop', async (req, res) => {
  const { id } = req.params;
  await stopQueue.add('stop', { botId: id }, { jobId: id, removeOnComplete: true, removeOnFail: true });
  res.json({ ok: true });
});

export default r;