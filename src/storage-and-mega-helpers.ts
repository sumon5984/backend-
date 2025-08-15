import { uploadAuthDir } from './storage.js';
import { uploadToMega } from './mega.js';

export { uploadAuthDir };

export async function onLoginUploadToMega(botId: string) {
  try {
    const link = await uploadToMega(botId);
    return { sessionId: botId, megaLink: link || undefined };
  } catch {
    return { sessionId: botId };
  }
}