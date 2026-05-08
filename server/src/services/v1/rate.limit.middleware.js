import rateLimit from "express-rate-limit";

// 1. Sabhi routes ke liye (General Protection)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: { success: false, message: "Too many requests from this IP, please try again later." },
  standardHeaders: true, // Rate limit info headers mein bhejega
  legacyHeaders: false,
});

// 2. Sirf Auth routes ke liye (High Security)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Sirf 10 attempts
  message: { success: false, message: "Too many attempts. Please try again after 15 minutes." },
});

// 3. Sensitive/Expensive Task Limiter (Example: OTP, Password Reset)
export const sensitiveTaskLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3, 
  message: { 
    success: false, 
    message: "You can only request 3 OTPs per hour. Please try again later." 
  },
  standardHeaders: true,
  legacyHeaders: false,
});