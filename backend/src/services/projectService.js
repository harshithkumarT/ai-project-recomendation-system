import { AppError } from "../utils/AppError.js";
import {
  createProject,
  deleteProjectById,
  getProjectByIdForUser,
  listProjectsByUser,
  updateProjectById
} from "../models/projectModel.js";
import {
  createBookmark,
  listBookmarkedProjects,
  removeBookmark
} from "../models/bookmarkModel.js";

export const createProjectItem = (userId, data) => createProject({ userId, ...data });

export const listProjectItems = ({ userId, page, limit }) => {
  const offset = (page - 1) * limit;
  return listProjectsByUser({ userId, limit, offset });
};

export const updateProjectItem = async ({ userId, projectId, data }) => {
  const mappedData = {};

  if (typeof data.title !== "undefined") mappedData.title = data.title;
  if (typeof data.description !== "undefined") mappedData.description = data.description;
  if (typeof data.status !== "undefined") mappedData.status = data.status;
  if (typeof data.progress !== "undefined") mappedData.progress = data.progress;
  if (typeof data.notes !== "undefined") mappedData.notes = data.notes;

  const project = await updateProjectById({ projectId, userId, data: mappedData });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

export const deleteProjectItem = async ({ userId, projectId }) => {
  const deleted = await deleteProjectById({ projectId, userId });
  if (!deleted) {
    throw new AppError("Project not found", 404);
  }
};

export const bookmarkProject = async ({ userId, projectId }) => {
  const exists = await getProjectByIdForUser({ projectId, userId });
  if (!exists) {
    throw new AppError("Project not found", 404);
  }

  await createBookmark({ userId, projectId });
};

export const unbookmarkProject = async ({ userId, projectId }) => {
  await removeBookmark({ userId, projectId });
};

export const listBookmarks = ({ userId, page, limit }) => {
  const offset = (page - 1) * limit;
  return listBookmarkedProjects({ userId, limit, offset });
};
