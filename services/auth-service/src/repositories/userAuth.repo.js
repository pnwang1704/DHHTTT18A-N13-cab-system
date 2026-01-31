async function findByEmail(client, email) {
  const { rows } = await client.query(
    "SELECT * FROM users_auth WHERE email = $1 LIMIT 1",
    [email],
  );
  return rows[0] || null;
}

async function findByPhone(client, phone) {
  const { rows } = await client.query(
    "SELECT * FROM users_auth WHERE phone = $1 LIMIT 1",
    [phone],
  );
  return rows[0] || null;
}

async function findByIdentifier(client, identifier) {
  const isEmail = identifier.includes("@");
  return isEmail
    ? findByEmail(client, identifier)
    : findByPhone(client, identifier);
}

async function createUser(client, { email, phone, passwordHash, role }) {
  const { rows } = await client.query(
    `INSERT INTO users_auth (email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [email || null, phone || null, passwordHash, role || "USER"],
  );
  return rows[0];
}

async function markLoginSuccess(client, userId) {
  await client.query(
    `UPDATE users_auth
     SET failed_login_count = 0,
         locked_until = NULL,
         last_login_at = now(),
         updated_at = now()
     WHERE id = $1`,
    [userId],
  );
}

async function markLoginFail(client, userId, maxFailed, lockMinutes) {
  const { rows } = await client.query(
    `UPDATE users_auth
     SET failed_login_count = failed_login_count + 1,
         updated_at = now()
     WHERE id = $1
     RETURNING failed_login_count`,
    [userId],
  );

  const failed = rows[0]?.failed_login_count ?? 0;
  if (failed >= maxFailed) {
    await client.query(
      `UPDATE users_auth
       SET locked_until = now() + ($2 || ' minutes')::interval,
           status = 'LOCKED',
           updated_at = now()
       WHERE id = $1`,
      [userId, String(lockMinutes)],
    );
  }
  return failed;
}

async function unlockIfTimePassed(client, user) {
  if (user.status !== "LOCKED") return user;
  if (!user.locked_until) return user;

  const now = new Date();
  const lockedUntil = new Date(user.locked_until);
  if (now >= lockedUntil) {
    const { rows } = await client.query(
      `UPDATE users_auth
       SET status='ACTIVE', failed_login_count=0, locked_until=NULL, updated_at=now()
       WHERE id=$1
       RETURNING *`,
      [user.id],
    );
    return rows[0];
  }
  return user;
}

module.exports = {
  findByEmail,
  findByPhone,
  findByIdentifier,
  createUser,
  markLoginSuccess,
  markLoginFail,
  unlockIfTimePassed,
};
