import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Authentification requise.' });
  }

  next();
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentification requise.' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Accès interdit.' });
    }

    next();
  };
};
