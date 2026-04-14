import { getProfileByUserId, upsertProfile } from "../models/profileModel.js";

export const getProfile = (userId) => getProfileByUserId(userId);

export const saveProfile = async (userId, data) => {
  return upsertProfile({
    userId,
    skillLevel: data.skillLevel,
    goals: data.goals,
    techStack: data.techStack,
    completedProjects: data.completedProjects || []
  });
};
