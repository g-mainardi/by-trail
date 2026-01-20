import rateLimit from 'express-rate-limit';
import { minsToMillis } from 'src/utils/middleware.js';

const windowDurationMins = 15;
const maxRequestPerWindow = 10;
const message = `Too many proposal submissions, please try again after ${windowDurationMins} minutes.`;

// Rate limiter for proposal submission endpoints
export const proposalRateLimiter = rateLimit({
  windowMs: minsToMillis(windowDurationMins),
  max: maxRequestPerWindow, // Limit each IP to n requests per windowMs
  message: message,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
