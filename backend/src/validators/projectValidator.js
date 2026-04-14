import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().min(10),
  status: z.enum(["todo", "in-progress", "completed"]).default("todo"),
  progress: z.number().min(0).max(100).default(0),
  notes: z.string().max(4000).optional().default("")
});

export const updateProjectSchema = createProjectSchema.partial();
