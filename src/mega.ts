import { Mega } from 'megajs';
import fs from 'fs';
import path from 'path';

export async function uploadToMega(botId: string) {
  if (!process.env.MEGA_EMAIL || !process.env.MEGA_PASSWORD) return null;
  const storage = await new Mega({ email: process.env.MEGA_EMAIL, password: process.env.MEGA_PASSWORD }).ready;
  const dir = path.join(process.cwd(), 'auth', botId);
  if (!fs.existsSync(dir)) return null;
  // For simplicity, upload a single creds.json if present; in real app, zip folder.
  const creds = ['creds.json', 'keys.json'].find(f => fs.existsSync(path.join(dir, f)));
  if (!creds) return null;
  const file = await storage.upload(`${botId}-${creds}`, fs.createReadStream(path.join(dir, creds))).complete;
  return (file as any).link && (file as any).link();
}