import { randomBytes, timingSafeEqual } from 'crypto';
import { Request, Response, NextFunction } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const csrfCookieSession = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = randomBytes(24).toString('hex');
  }

  res.setHeader('x-csrf-token', req.session.csrfToken);
  next();
};

export const requireCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const incoming = req.get('x-csrf-token');
  const expected = req.session.csrfToken;
  if (!incoming || !expected) {
    return res.status(403).json({ message: 'CSRF token invalide.' });
  }

  const incomingBuffer = Buffer.from(incoming);
  const expectedBuffer = Buffer.from(expected);

  if (
    incomingBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(incomingBuffer, expectedBuffer)
  ) {
    return res.status(403).json({ message: 'CSRF token invalide.' });
  }

  return next();
};
