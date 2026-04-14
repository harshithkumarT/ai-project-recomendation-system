import { asyncHandler } from "../utils/asyncHandler.js";
import {
  bookmarkProject,
  createProjectItem,
  deleteProjectItem,
  listBookmarks,
  listProjectItems,
  unbookmarkProject,
  updateProjectItem
} from "../services/projectService.js";

export const createProject = asyncHandler(async (req, res) => {
  const project = await createProjectItem(req.user.id, req.body);
  res.status(201).json({ project });
});

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await listProjectItems({
    userId: req.user.id,
    page: req.query.page,
    limit: req.query.limit
  });

  res.status(200).json({ projects });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await updateProjectItem({
    userId: req.user.id,
    projectId: req.params.id,
    data: req.body
  });

  res.status(200).json({ project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  await deleteProjectItem({ userId: req.user.id, projectId: req.params.id });
  res.status(200).json({ message: "Project deleted" });
});

export const addBookmark = asyncHandler(async (req, res) => {
  await bookmarkProject({ userId: req.user.id, projectId: req.params.id });
  res.status(200).json({ message: "Bookmarked" });
});

export const removeBookmark = asyncHandler(async (req, res) => {
  await unbookmarkProject({ userId: req.user.id, projectId: req.params.id });
  res.status(200).json({ message: "Bookmark removed" });
});

export const listMyBookmarks = asyncHandler(async (req, res) => {
  const projects = await listBookmarks({
    userId: req.user.id,
    page: req.query.page,
    limit: req.query.limit
  });

  res.status(200).json({ projects });
});
