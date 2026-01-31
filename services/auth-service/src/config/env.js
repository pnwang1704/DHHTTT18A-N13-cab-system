const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

function must(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function toBool(v, def = false) {
  if (v == null) return def;
  return String(v).toLowerCase() === "true";
}

function toInt(v, def) {
  if (v == null) return def;
  const n = Number(v);
  if (!Number.isFinite(n)) return def;
  return n;
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toInt(process.env.PORT, 3001),

  db: {
    host: must("DB_HOST"),
    port: toInt(process.env.DB_PORT, 5432),
    name: must("DB_NAME"),
    user: must("DB_USER"),
    pass: must("DB_PASS"),
    ssl: toBool(process.env.DB_SSL, false),
  },

  jwt: {
    issuer: must("JWT_ISSUER"),
    audience: must("JWT_AUDIENCE"),
    accessTtlSeconds: toInt(process.env.JWT_ACCESS_TTL_SECONDS, 900),
    privateKeyPath: path.resolve(process.cwd(), must("JWT_PRIVATE_KEY_PATH")),
    publicKeyPath: path.resolve(process.cwd(), must("JWT_PUBLIC_KEY_PATH")),
    jwksKid: must("JWKS_KID"),
  },

  refresh: {
    ttlDays: toInt(process.env.REFRESH_TTL_DAYS, 30),
    salt: must("REFRESH_TOKEN_SALT"),
  },

  security: {
    bcryptRounds: toInt(process.env.BCRYPT_SALT_ROUNDS, 12),
    maxFailed: toInt(process.env.LOGIN_MAX_FAILED, 5),
    lockMinutes: toInt(process.env.LOGIN_LOCK_MINUTES, 15),
  },

  rateLimit: {
    windowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
    loginMax: toInt(process.env.RATE_LIMIT_LOGIN_MAX, 20),
    registerMax: toInt(process.env.RATE_LIMIT_REGISTER_MAX, 10),
  },
};

module.exports = { env };
