const { jwtVerify } = require("jose");
const { env } = require("../config/env");
const { HttpError } = require("../utils/httpError");

function authMiddleware(publicKey) {
  return async (req, res, next) => {
    try {
      const h = req.headers.authorization || "";
      const token = h.startsWith("Bearer ") ? h.slice(7) : null;
      if (!token)
        throw new HttpError(401, "UNAUTHORIZED", "Missing bearer token");

      const { payload } = await jwtVerify(token, publicKey, {
        issuer: env.jwt.issuer,
        audience: env.jwt.audience,
      });

      req.user = {
        userId: String(payload.sub),
        role: payload.role,
      };

      return next();
    } catch (e) {
      return next(
        new HttpError(401, "UNAUTHORIZED", "Invalid or expired token"),
      );
    }
  };
}

module.exports = { authMiddleware };
