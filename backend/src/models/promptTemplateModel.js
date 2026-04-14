import { query } from "../config/db.js";

const defaultTemplate = `Based on user's skill level: {skill}, goals: {goals}, and tech stack: {stack}, generate:\n1. 3 project ideas\n2. Detailed roadmap\n3. Required technologies\n\nReturn strictly valid JSON with this shape:\n{\n  \"projectIdeas\": [{\"title\": \"\", \"description\": \"\", \"difficulty\": \"\"}],\n  \"roadmap\": [{\"phase\": \"\", \"steps\": [\"\"]}],\n  \"requiredTechnologies\": [\"\"]\n}`;

export const ensureDefaultPromptTemplate = async () => {
  await query(
    `INSERT INTO prompt_templates (name, template)
     VALUES ('default_recommendation', $1)
     ON CONFLICT (name) DO NOTHING`,
    [defaultTemplate]
  );
};

export const getDefaultPromptTemplate = async () => {
  const { rows } = await query(
    "SELECT id, name, template, updated_at FROM prompt_templates WHERE name = 'default_recommendation' LIMIT 1"
  );
  return rows[0] || null;
};

export const updateDefaultPromptTemplate = async (template) => {
  const { rows } = await query(
    `UPDATE prompt_templates
     SET template = $1, updated_at = NOW()
     WHERE name = 'default_recommendation'
     RETURNING id, name, template, updated_at`,
    [template]
  );

  return rows[0] || null;
};
