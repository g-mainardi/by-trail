import jwt, { JwtPayload } from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

import { UserModel as User } from '../models/User.js';
import { getSecret } from '../utils/secrets.js';
import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/server_only.js';
import { minsToMillis } from 'src/utils/middleware.js';
import mongoose from 'mongoose';
import { UserStatusEnum } from '@by-trail/shared';

const windowDurationMins = 15;
const maxRequestPerWindow = 10;
const message = `Too many authentication attempts, please try again after ${windowDurationMins} minutes.`;

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  // 1. Check if header Authorization is present and starts with "Bearer"
  // Standard format: "Bearer <token_string>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Take only the token (remove "Bearer " prefix)
      token = req.headers.authorization.split(' ')[1];

      // 3. Retrieve the secret
      // Note: Must be the same used to sign the token during login
      const JWT_SECRET = getSecret('JWT_SECRET', 'JWT_SECRET');

      // 4. Verify token validity
      const decoded: JwtPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;

      // 5. Search the user in the DB (without the password field)
      // Fundamental to check if user still exists
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res
          .status(401)
          .json({ message: 'User not found / Token invalid' });
      }

      if (!req.user._id) {
        return res
          .status(401)
          .json({ message: 'User ID missing / Token invalid' });
      }

      if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        return res.status(400).json({ error: 'Invalid user ID format' });
      }

      // 6. Check if user is banned
      if (req.user.status === UserStatusEnum.BANNED) {
        return res.status(403).json({ message: 'User is banned' });
      }

      // 7. If all good, proceed to next middleware/controller
      next();
    } catch (error) {
      console.error('Auth Middleware Error');
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Rate limiter for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: minsToMillis(windowDurationMins),
  max: maxRequestPerWindow, // Limit each IP to n requests per windowMs
  message: message,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
