import { z } from "zod";

export const recommendationRequestSchema = z.object({
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  goals: z.array(z.string().min(2)).min(1),
  techStack: z.array(z.string().min(1)).min(1)
});
