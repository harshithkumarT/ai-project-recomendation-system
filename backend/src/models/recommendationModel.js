import { query } from "../config/db.js";

export const createRecommendation = async ({ userId, aiResponse }) => {
  const { rows } = await query(
    `INSERT INTO recommendations (user_id, ai_response)
     VALUES ($1, $2)
     RETURNING id, user_id, ai_response, created_at`,
    [userId, aiResponse]
  );

  return rows[0];
};

export const listRecommendationsByUser = async ({ userId, limit, offset }) => {
  const { rows } = await query(
    `SELECT id, user_id, ai_response, created_at
     FROM recommendations
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return rows;
};

export const getRecommendationByIdForUser = async ({ id, userId }) => {
  const { rows } = await query(
    `SELECT id, user_id, ai_response, created_at
     FROM recommendations
     WHERE id = $1 AND user_id = $2
     LIMIT 1`,
    [id, userId]
  );

  return rows[0] || null;
};

export const logAiUsage = async ({ userId, promptTokens, completionTokens, model }) => {
  await query(
    `INSERT INTO ai_usage (user_id, prompt_tokens, completion_tokens, model)
     VALUES ($1, $2, $3, $4)`,
    [userId, promptTokens, completionTokens, model]
  );
};

export const getAiUsageStats = async () => {
  const { rows } = await query(
    `SELECT
      COUNT(*)::int AS total_requests,
      COALESCE(SUM(prompt_tokens), 0)::int AS total_prompt_tokens,
      COALESCE(SUM(completion_tokens), 0)::int AS total_completion_tokens
     FROM ai_usage`
  );

  return rows[0];
};
