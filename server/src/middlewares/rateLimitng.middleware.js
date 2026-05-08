import rateLimit from 'express-rate-limit';

// 1. Global Limiter: 100 requests every 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again after 15 minutes.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// 2. Auth Limiter: Strict limit for login/signup (5 requests per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  message: "Too many login attempts, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Sensitive Limiter: Very strict for critical operations (e.g., 3 requests per hour)
export const sensitiveTaskLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Hour
  max: 10, 
  message: "Too many sensitive requests. Please wait an hour.",
  standardHeaders: true,
  legacyHeaders: false,
});