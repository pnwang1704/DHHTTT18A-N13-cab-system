async function createRefreshToken(
  client,
  { userId, tokenHash, expiresAt, userAgent, ip, replacedByTokenId },
) {
  const { rows } = await client.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, user_agent, ip, replaced_by_token_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      userId,
      tokenHash,
      expiresAt,
      userAgent || null,
      ip || null,
      replacedByTokenId || null,
    ],
  );
  return rows[0];
}

async function findValidByHash(client, tokenHash) {
  const { rows } = await client.query(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = $1
       AND revoked_at IS NULL
       AND expires_at > now()
     LIMIT 1`,
    [tokenHash],
  );
  return rows[0] || null;
}

async function revokeByHash(client, tokenHash) {
  await client.query(
    `UPDATE refresh_tokens
     SET revoked_at = now()
     WHERE token_hash = $1 AND revoked_at IS NULL`,
    [tokenHash],
  );
}

async function revokeById(client, id) {
  await client.query(
    `UPDATE refresh_tokens
     SET revoked_at = now()
     WHERE id = $1 AND revoked_at IS NULL`,
    [id],
  );
}

module.exports = {
  createRefreshToken,
  findValidByHash,
  revokeByHash,
  revokeById,
};
