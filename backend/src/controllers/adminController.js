import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getAiUsageAdmin,
  getPromptTemplateAdmin,
  listUsersAdmin,
  updatePromptTemplateAdmin
} from "../services/adminService.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await listUsersAdmin({
    page: req.query.page,
    limit: req.query.limit
  });

  res.status(200).json({ users });
});

export const getAiUsage = asyncHandler(async (_req, res) => {
  const usage = await getAiUsageAdmin();
  res.status(200).json({ usage });
});

export const getPromptTemplate = asyncHandler(async (_req, res) => {
  const template = await getPromptTemplateAdmin();
  res.status(200).json({ template });
});

export const updatePromptTemplate = asyncHandler(async (req, res) => {
  const template = await updatePromptTemplateAdmin(req.body.template);
  res.status(200).json({ template });
});
