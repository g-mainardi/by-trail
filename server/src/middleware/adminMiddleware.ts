import { NextFunction, Response } from 'express';
import { UserTypeEnum } from '../types/index.js';
import { AuthRequest } from '../types/server_only.js';

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Defensive check: If req.user is missing, someone probably forgot to add 'protect' before 'admin' in the routes
  if (!req.user) {
    return res
      .status(500)
      .json({ message: 'Server Error: Auth middleware missing' });
  }

  if (req.user.type === UserTypeEnum.ADMIN) {
    next();
  } else {
    // It's a user but not an admin
    return res.status(403).json({ message: 'Admin access required' });
  }
};
