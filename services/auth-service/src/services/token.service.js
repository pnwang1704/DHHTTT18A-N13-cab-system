const { SignJWT } = require("jose");
const { exportJWK } = require("jose");
const { env } = require("../config/env");
const { sha256Hex, randomTokenBase64Url } = require("../utils/crypto");

async function signAccessToken(privateKey, { userId, role }) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + env.jwt.accessTtlSeconds;

  return new SignJWT({ role })
    .setProtectedHeader({ alg: "RS256", kid: env.jwt.jwksKid, typ: "JWT" })
    .setIssuer(env.jwt.issuer)
    .setAudience(env.jwt.audience)
    .setSubject(String(userId))
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(privateKey);
}

function generateRefreshToken() {
  return randomTokenBase64Url(48);
}

function hashRefreshToken(refreshToken) {
  return sha256Hex(`${refreshToken}.${env.refresh.salt}`);
}

function refreshExpiresAt() {
  const d = new Date();
  d.setDate(d.getDate() + env.refresh.ttlDays);
  return d;
}

async function buildJWKS(publicKey) {
  const jwk = await exportJWK(publicKey);
  jwk.use = "sig";
  jwk.alg = "RS256";
  jwk.kid = env.jwt.jwksKid;
  return { keys: [jwk] };
}

module.exports = {
  signAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  refreshExpiresAt,
  buildJWKS,
};
