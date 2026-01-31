const rateLimit = require("express-rate-limit");
const { env } = require("../config/env");

const loginLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  limit: env.rateLimit.loginMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: { code: "RATE_LIMIT", message: "Too many login attempts" },
  },
});

const registerLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  limit: env.rateLimit.registerMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: { code: "RATE_LIMIT", message: "Too many register attempts" },
  },
});

module.exports = { loginLimiter, registerLimiter };
