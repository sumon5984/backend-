import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function jwtVerify(req: Request, res: Response, next: NextFunction) {
  // Very simple guard: accept any Bearer if JWT_SECRET missing (for dev)
  const header = req.headers.authorization || '';
  if (!process.env.JWT_SECRET) {
    (req as any).user = { id: 'dev-user' };
    return next();
  }
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as any).user = { id: payload.sub || payload.id || payload.userId || 'user' };
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}