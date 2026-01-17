import { NextFunction, Response } from 'express';
import { AuthRequest } from 'src/types/index.js';

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Defensive check: If req.user is missing, someone probably forgot to add 'protect' before 'admin' in the routes
  if (!req.user) {
    return res
      .status(500)
      .json({ message: 'Server Error: Auth middleware missing' });
  }

  if (req.user.type === 'admin') {
    next();
  } else {
    // It's a user but not an admin
    res.status(403).json({ message: 'Admin access required' }); //
  }
};
