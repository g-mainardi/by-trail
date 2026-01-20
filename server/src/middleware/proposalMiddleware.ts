import rateLimit from 'express-rate-limit';

// Rate limiter for proposal submission endpoints
export const proposalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 sends per windowMs
  message:
    'Too many proposals were sent from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
