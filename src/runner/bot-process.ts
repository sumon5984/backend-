import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { uploadAuthDir, onLoginUploadToMega } from '../storage-and-mega-helpers.js';
import { ioEmit } from '../util-io.js';

(async () => {
  const botId = process.env.BOT_ID!;
  const { state, saveCreds } = await useMultiFileAuthState(`./auth/${botId}`);

  const sock = makeWASocket({ auth: state, printQRInTerminal: false, syncFullHistory: false });

  sock.ev.on('connection.update', async (u: any) => {
    const { connection, lastDisconnect, qr, pairingCode } = u;
    if (qr) ioEmit(botId, { type: 'qr', qr });
    if (pairingCode) ioEmit(botId, { type: 'pair_code', code: pairingCode });

    if (connection === 'open') {
      await saveCreds();
      await uploadAuthDir(botId);
      const result = await onLoginUploadToMega(botId);
      ioEmit(botId, { type: 'ready', result });
    }

    if (connection === 'close') {
      const code = (lastDisconnect?.error as any)?.output?.statusCode;
      ioEmit(botId, { type: 'closed', code });
      if (code !== DisconnectReason.loggedOut) {
        // Auto-reconnect handled internally by Baileys
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m?.message || m.key.fromMe) return;
    const text = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
    if (text?.trim().toLowerCase() === '!ping') {
      await sock.sendMessage(m.key.remoteJid!, { text: 'pong ✅' });
    }
  });

})().catch(err => {
  console.error('bot-process error', err);
  process.exit(1);
});