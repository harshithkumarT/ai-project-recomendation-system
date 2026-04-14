import { query } from "../config/db.js";

export const createBookmark = async ({ userId, projectId }) => {
  await query(
    `INSERT INTO bookmarks (user_id, project_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, project_id) DO NOTHING`,
    [userId, projectId]
  );
};

export const removeBookmark = async ({ userId, projectId }) => {
  await query("DELETE FROM bookmarks WHERE user_id = $1 AND project_id = $2", [userId, projectId]);
};

export const listBookmarkedProjects = async ({ userId, limit, offset }) => {
  const { rows } = await query(
    `SELECT p.id, p.user_id, p.title, p.description, p.status, p.progress, p.notes, p.created_at, p.updated_at
     FROM bookmarks b
     INNER JOIN projects p ON p.id = b.project_id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return rows;
};
