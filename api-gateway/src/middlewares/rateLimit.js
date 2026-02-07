const rateLimit = require('express-rate-limit');

// Rate limit mặc định cho toàn gateway
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  limit: 120,          // 120 requests / IP / phút
  standardHeaders: true, // trả RateLimit-* headers
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
});

// Rate limit chặt hơn cho Auth (chống brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  limit: 20,                // 20 requests / IP / 15 phút (login/register)
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many auth attempts, please try again later.' }
});

module.exports = {
  globalLimiter,
  authLimiter
};
