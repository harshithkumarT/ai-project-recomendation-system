import { query } from "../config/db.js";

export const saveRefreshToken = async ({ userId, tokenHash, expiresAt }) => {
  await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );
};

export const findValidRefreshToken = async ({ userId, tokenHash }) => {
  const { rows } = await query(
    `SELECT id, user_id, token_hash, expires_at, is_revoked
     FROM refresh_tokens
     WHERE user_id = $1
       AND token_hash = $2
       AND is_revoked = false
       AND expires_at > NOW()
     LIMIT 1`,
    [userId, tokenHash]
  );
  return rows[0] || null;
};

export const revokeRefreshToken = async (id) => {
  await query("UPDATE refresh_tokens SET is_revoked = true WHERE id = $1", [id]);
};

export const revokeAllUserRefreshTokens = async (userId) => {
  await query("UPDATE refresh_tokens SET is_revoked = true WHERE user_id = $1", [userId]);
};
