import { query } from "../config/db.js";

export const createProject = async ({ userId, title, description, status, progress, notes }) => {
  const { rows } = await query(
    `INSERT INTO projects (user_id, title, description, status, progress, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, user_id, title, description, status, progress, notes, created_at, updated_at`,
    [userId, title, description, status, progress, notes]
  );
  return rows[0];
};

export const getProjectByIdForUser = async ({ projectId, userId }) => {
  const { rows } = await query(
    `SELECT id, user_id, title, description, status, progress, notes, created_at, updated_at
     FROM projects
     WHERE id = $1 AND user_id = $2
     LIMIT 1`,
    [projectId, userId]
  );
  return rows[0] || null;
};

export const listProjectsByUser = async ({ userId, limit, offset }) => {
  const { rows } = await query(
    `SELECT id, user_id, title, description, status, progress, notes, created_at, updated_at
     FROM projects
     WHERE user_id = $1
     ORDER BY updated_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return rows;
};

export const updateProjectById = async ({ projectId, userId, data }) => {
  const fields = [];
  const values = [];
  let idx = 1;

  Object.entries(data).forEach(([key, value]) => {
    fields.push(`${key} = $${idx}`);
    values.push(value);
    idx += 1;
  });

  if (fields.length === 0) {
    return getProjectByIdForUser({ projectId, userId });
  }

  values.push(projectId, userId);

  const { rows } = await query(
    `UPDATE projects
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${idx} AND user_id = $${idx + 1}
     RETURNING id, user_id, title, description, status, progress, notes, created_at, updated_at`,
    values
  );

  return rows[0] || null;
};

export const deleteProjectById = async ({ projectId, userId }) => {
  const { rowCount } = await query("DELETE FROM projects WHERE id = $1 AND user_id = $2", [projectId, userId]);
  return rowCount > 0;
};
