import { listUsers } from "../models/userModel.js";
import { getAiUsageStats } from "../models/recommendationModel.js";
import {
  getDefaultPromptTemplate,
  updateDefaultPromptTemplate
} from "../models/promptTemplateModel.js";

export const listUsersAdmin = ({ page, limit }) => {
  const offset = (page - 1) * limit;
  return listUsers({ limit, offset });
};

export const getAiUsageAdmin = () => getAiUsageStats();

export const getPromptTemplateAdmin = () => getDefaultPromptTemplate();

export const updatePromptTemplateAdmin = (template) => updateDefaultPromptTemplate(template);
