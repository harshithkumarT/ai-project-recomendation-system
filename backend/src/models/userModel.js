import { query } from "../config/db.js";

export const findUserByEmail = async (email) => {
  const { rows } = await query(
    "SELECT id, name, email, password, role, created_at FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  return rows[0] || null;
};

export const findUserById = async (id) => {
  const { rows } = await query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1 LIMIT 1",
    [id]
  );
  return rows[0] || null;
};

export const createUser = async ({ name, email, passwordHash, role = "user" }) => {
  const { rows } = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, passwordHash, role]
  );
  return rows[0];
};

export const listUsers = async ({ limit, offset }) => {
  const { rows } = await query(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
};
