import OpenAI from "openai";
import { z } from "zod";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import {
  createRecommendation,
  listRecommendationsByUser,
  logAiUsage
} from "../models/recommendationModel.js";
import {
  ensureDefaultPromptTemplate,
  getDefaultPromptTemplate
} from "../models/promptTemplateModel.js";

const recommendationSchema = z.object({
  projectIdeas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      difficulty: z.string()
    })
  ),
  roadmap: z.array(
    z.object({
      phase: z.string(),
      steps: z.array(z.string())
    })
  ),
  requiredTechnologies: z.array(z.string())
});

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const safeJsonParse = (rawText) => {
  const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned);
};

const buildPrompt = (template, payload) => {
  return template
    .replace("{skill}", payload.skillLevel)
    .replace("{goals}", payload.goals.join(", "))
    .replace("{stack}", payload.techStack.join(", "));
};

export const generateRecommendation = async ({ userId, profileInput }) => {
  await ensureDefaultPromptTemplate();
  const promptTemplate = await getDefaultPromptTemplate();

  const prompt = buildPrompt(promptTemplate.template, profileInput);

  const completion = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a strict project mentor assistant. Always return valid JSON only, no markdown, no comments."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1200
  });

  const content = completion.choices?.[0]?.message?.content || "{}";

  let parsed;
  try {
    parsed = recommendationSchema.parse(safeJsonParse(content));
  } catch {
    throw new AppError("AI returned an invalid response format", 502);
  }

  const saved = await createRecommendation({ userId, aiResponse: parsed });

  await logAiUsage({
    userId,
    promptTokens: completion.usage?.prompt_tokens || 0,
    completionTokens: completion.usage?.completion_tokens || 0,
    model: env.OPENAI_MODEL
  });

  return saved;
};

export const listRecommendations = ({ userId, page, limit }) => {
  const offset = (page - 1) * limit;
  return listRecommendationsByUser({ userId, limit, offset });
};
