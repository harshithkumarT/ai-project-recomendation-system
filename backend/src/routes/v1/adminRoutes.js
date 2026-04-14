import { Router } from "express";
import {
  getAiUsage,
  getPromptTemplate,
  listUsers,
  updatePromptTemplate
} from "../../controllers/adminController.js";
import { authorizeRoles, protect } from "../../middlewares/authMiddleware.js";
import { validate } from "../../middlewares/validate.js";
import { paginationSchema } from "../../validators/commonValidator.js";
import { z } from "zod";

const router = Router();

const promptSchema = z.object({
  template: z.string().min(20)
});

router.use(protect, authorizeRoles("admin"));

router.get("/users", validate(paginationSchema, "query"), listUsers);
router.get("/ai-usage", getAiUsage);
router.get("/prompt-template", getPromptTemplate);
router.put("/prompt-template", validate(promptSchema), updatePromptTemplate);

export default router;
