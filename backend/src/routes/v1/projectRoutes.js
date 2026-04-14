import { Router } from "express";
import {
  addBookmark,
  createProject,
  deleteProject,
  listMyBookmarks,
  listProjects,
  removeBookmark,
  updateProject
} from "../../controllers/projectController.js";
import { protect } from "../../middlewares/authMiddleware.js";
import { validate } from "../../middlewares/validate.js";
import { paginationSchema, uuidParamSchema } from "../../validators/commonValidator.js";
import {
  createProjectSchema,
  updateProjectSchema
} from "../../validators/projectValidator.js";

const router = Router();

router.use(protect);

router.get("/", validate(paginationSchema, "query"), listProjects);
router.post("/", validate(createProjectSchema), createProject);
router.put("/:id", validate(uuidParamSchema, "params"), validate(updateProjectSchema), updateProject);
router.delete("/:id", validate(uuidParamSchema, "params"), deleteProject);

router.get("/bookmarks/list", validate(paginationSchema, "query"), listMyBookmarks);
router.post("/:id/bookmark", validate(uuidParamSchema, "params"), addBookmark);
router.delete("/:id/bookmark", validate(uuidParamSchema, "params"), removeBookmark);

export default router;
