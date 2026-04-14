import { asyncHandler } from "../utils/asyncHandler.js";
import { generateRecommendation, listRecommendations } from "../services/aiService.js";
import { getProfile } from "../services/profileService.js";
import { AppError } from "../utils/AppError.js";

export const createRecommendation = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user.id);

  const profileInput = profile
    ? {
        skillLevel: profile.skill_level,
        goals: profile.goals,
        techStack: profile.tech_stack
      }
    : req.body;

  if (!profileInput?.skillLevel || !profileInput?.goals || !profileInput?.techStack) {
    throw new AppError("Provide profile data or complete profile first", 400);
  }

  const recommendation = await generateRecommendation({
    userId: req.user.id,
    profileInput
  });

  res.status(201).json({ recommendation });
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await listRecommendations({
    userId: req.user.id,
    page: req.query.page,
    limit: req.query.limit
  });

  res.status(200).json({ recommendations });
});
