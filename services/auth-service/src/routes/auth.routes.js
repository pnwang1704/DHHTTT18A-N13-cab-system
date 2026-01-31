const express = require("express");
const { asyncHandler } = require("../middlewares/asyncHandler");
const { validateBody } = require("../middlewares/validate.middleware");
const {
  loginLimiter,
  registerLimiter,
} = require("../middlewares/rateLimit.middleware");
const {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
} = require("../utils/validators");

function authRoutes(deps) {
  const r = express.Router();
  const c = deps.controller;

  r.get("/.well-known/jwks.json", asyncHandler(c.jwks));

  r.post(
    "/register",
    registerLimiter,
    validateBody(registerSchema),
    asyncHandler(c.register),
  );
  r.post(
    "/login",
    loginLimiter,
    validateBody(loginSchema),
    asyncHandler(c.login),
  );
  r.post("/refresh", validateBody(refreshSchema), asyncHandler(c.refresh));
  r.post("/logout", validateBody(logoutSchema), asyncHandler(c.logout));

  r.get("/me", deps.authMiddleware, asyncHandler(c.me));

  return r;
}

module.exports = { authRoutes };
