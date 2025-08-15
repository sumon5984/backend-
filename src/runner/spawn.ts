import { fork } from 'child_process';
const processes = new Map<string, ReturnType<typeof fork>>();

export async function spawnBot(botId: string) {
  if (processes.has(botId)) return;
  const child = fork(new URL('./bot-process.ts', import.meta.url).pathname, {
    env: { ...process.env, BOT_ID: botId },
    execArgv: ['-r', 'ts-node/register/transpile-only']
  });
  processes.set(botId, child);
  child.on('exit', (code) => {
    processes.delete(botId);
    console.log('bot', botId, 'exit', code);
  });
}

export async function stopBot(botId: string) {
  const p = processes.get(botId);
  if (!p) return;
  p.kill('SIGTERM');
  processes.delete(botId);
}