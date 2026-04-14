import { asyncHandler } from "../utils/asyncHandler.js";
import { getProfile, saveProfile } from "../services/profileService.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user.id);
  res.status(200).json({ profile });
});

export const upsertMyProfile = asyncHandler(async (req, res) => {
  const profile = await saveProfile(req.user.id, req.body);
  res.status(200).json({ profile });
});
