import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore - session.user augmentation
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

export function attachNoCache(_: Request, res: Response, next: NextFunction) {
  // Prevent cached responses from being served to logged-out users
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
}
