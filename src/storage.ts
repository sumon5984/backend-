import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: process.env.S3_KEY && process.env.S3_SECRET ? {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET
  } : undefined
});

export async function uploadAuthDir(botId: string) {
  if (!process.env.S3_BUCKET) return;
  const dir = path.join(process.cwd(), 'auth', botId);
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const Body = fs.createReadStream(path.join(dir, f));
    await s3.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: `${botId}/${f}`, Body }));
  }
}

export async function downloadAuthDir(_botId: string) {
  // Simplified: left as an exercise (list and save each file locally)
  return;
}