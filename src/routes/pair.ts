import { Router } from 'express';
import { prisma } from '../prisma.js';
import { startQueue } from '../queues.js';

const r = Router();

r.post('/create', async (req, res) => {
  const userId = (req as any).user.id;
  const bot = await prisma.bot.create({ data: { userId, name: req.body?.name || 'My Bot' } });
  res.json(bot);
});

r.post('/:botId/start', async (req, res) => {
  const botId = req.params.botId;
  await startQueue.add('start', { botId }, { jobId: botId, removeOnComplete: true, removeOnFail: true });
  res.json({ ok: true });
});

export default r;