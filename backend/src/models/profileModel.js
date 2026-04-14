import { query } from "../config/db.js";

export const getProfileByUserId = async (userId) => {
  const { rows } = await query(
    `SELECT user_id, skill_level, goals, tech_stack, completed_projects, updated_at
     FROM profiles
     WHERE user_id = $1
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
};

export const upsertProfile = async ({ userId, skillLevel, goals, techStack, completedProjects }) => {
  const { rows } = await query(
    `INSERT INTO profiles (user_id, skill_level, goals, tech_stack, completed_projects)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id)
     DO UPDATE SET
       skill_level = EXCLUDED.skill_level,
       goals = EXCLUDED.goals,
       tech_stack = EXCLUDED.tech_stack,
       completed_projects = EXCLUDED.completed_projects,
       updated_at = NOW()
     RETURNING user_id, skill_level, goals, tech_stack, completed_projects, updated_at`,
    [userId, skillLevel, goals, techStack, completedProjects]
  );

  return rows[0];
};
