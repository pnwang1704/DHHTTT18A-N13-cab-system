const bcrypt = require("bcrypt");
const { HttpError } = require("../utils/httpError");
const { env } = require("../config/env");
const userRepo = require("../repositories/userAuth.repo");
const rtRepo = require("../repositories/refreshToken.repo");
const tokenSvc = require("./token.service");

function getClientInfo(req) {
  const userAgent = req.headers["user-agent"] || null;
  const ip =
    (req.headers["x-forwarded-for"] &&
      String(req.headers["x-forwarded-for"]).split(",")[0].trim()) ||
    req.socket?.remoteAddress ||
    null;
  return { userAgent, ip };
}

async function register(client, keys, req, { email, phone, password, role }) {
  // ensure unique (explicit checks help produce nicer errors than pg 23505)
  if (email) {
    const existed = await userRepo.findByEmail(client, email);
    if (existed)
      throw new HttpError(409, "EMAIL_EXISTS", "Email already exists");
  }
  if (phone) {
    const existed = await userRepo.findByPhone(client, phone);
    if (existed)
      throw new HttpError(409, "PHONE_EXISTS", "Phone already exists");
  }

  const passwordHash = await bcrypt.hash(password, env.security.bcryptRounds);
  const user = await userRepo.createUser(client, {
    email,
    phone,
    passwordHash,
    role,
  });

  const accessToken = await tokenSvc.signAccessToken(keys.privateKey, {
    userId: user.id,
    role: user.role,
  });

  const refreshToken = tokenSvc.generateRefreshToken();
  const tokenHash = tokenSvc.hashRefreshToken(refreshToken);
  const expiresAt = tokenSvc.refreshExpiresAt();
  const { userAgent, ip } = getClientInfo(req);

  await rtRepo.createRefreshToken(client, {
    userId: user.id,
    tokenHash,
    expiresAt,
    userAgent,
    ip,
  });

  return { userId: user.id, accessToken, refreshToken };
}

async function login(client, keys, req, { identifier, password }) {
  let user = await userRepo.findByIdentifier(client, identifier);
  if (!user)
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid credentials");

  user = await userRepo.unlockIfTimePassed(client, user);

  if (
    user.status === "LOCKED" &&
    user.locked_until &&
    new Date() < new Date(user.locked_until)
  ) {
    throw new HttpError(
      423,
      "ACCOUNT_LOCKED",
      "Account is temporarily locked",
      {
        lockedUntil: user.locked_until,
      },
    );
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    await userRepo.markLoginFail(
      client,
      user.id,
      env.security.maxFailed,
      env.security.lockMinutes,
    );
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  // if previously locked but time passed, unlockIfTimePassed already handled
  if (user.status !== "ACTIVE") {
    // allow ACTIVE only for login
    throw new HttpError(403, "ACCOUNT_NOT_ACTIVE", "Account is not active", {
      status: user.status,
    });
  }

  await userRepo.markLoginSuccess(client, user.id);

  const accessToken = await tokenSvc.signAccessToken(keys.privateKey, {
    userId: user.id,
    role: user.role,
  });

  // issue new refresh token on every login
  const refreshToken = tokenSvc.generateRefreshToken();
  const tokenHash = tokenSvc.hashRefreshToken(refreshToken);
  const expiresAt = tokenSvc.refreshExpiresAt();
  const { userAgent, ip } = getClientInfo(req);

  await rtRepo.createRefreshToken(client, {
    userId: user.id,
    tokenHash,
    expiresAt,
    userAgent,
    ip,
  });

  return { userId: user.id, accessToken, refreshToken };
}

async function refresh(client, keys, req, { refreshToken }) {
  const tokenHash = tokenSvc.hashRefreshToken(refreshToken);
  const existing = await rtRepo.findValidByHash(client, tokenHash);
  if (!existing)
    throw new HttpError(
      401,
      "INVALID_REFRESH",
      "Invalid or expired refresh token",
    );

  // revoke old
  await rtRepo.revokeById(client, existing.id);

  // create new refresh token
  const newRefreshToken = tokenSvc.generateRefreshToken();
  const newHash = tokenSvc.hashRefreshToken(newRefreshToken);
  const expiresAt = tokenSvc.refreshExpiresAt();
  const { userAgent, ip } = getClientInfo(req);

  const newRow = await rtRepo.createRefreshToken(client, {
    userId: existing.user_id,
    tokenHash: newHash,
    expiresAt,
    userAgent,
    ip,
    replacedByTokenId: null,
  });

  // Optionally: update replaced_by_token_id of old token for trace
  await client.query(
    "UPDATE refresh_tokens SET replaced_by_token_id = $1 WHERE id = $2",
    [newRow.id, existing.id],
  );

  // need role for access token
  const { rows } = await client.query(
    "SELECT id, role, status FROM users_auth WHERE id = $1 LIMIT 1",
    [existing.user_id],
  );
  const user = rows[0];
  if (!user)
    throw new HttpError(401, "INVALID_REFRESH", "Invalid refresh token");
  if (user.status !== "ACTIVE")
    throw new HttpError(403, "ACCOUNT_NOT_ACTIVE", "Account is not active");

  const accessToken = await tokenSvc.signAccessToken(keys.privateKey, {
    userId: user.id,
    role: user.role,
  });

  return { accessToken, refreshToken: newRefreshToken };
}

async function logout(client, { refreshToken }) {
  const tokenHash = tokenSvc.hashRefreshToken(refreshToken);
  await rtRepo.revokeByHash(client, tokenHash);
  return { ok: true };
}

function me(user) {
  return { userId: user.userId, role: user.role };
}

module.exports = { register, login, refresh, logout, me };
