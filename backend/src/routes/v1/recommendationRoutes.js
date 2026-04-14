import { Router } from "express";
import {
  createRecommendation,
  getRecommendations
} from "../../controllers/recommendationController.js";
import { protect } from "../../middlewares/authMiddleware.js";
import { validate } from "../../middlewares/validate.js";
import { paginationSchema } from "../../validators/commonValidator.js";

const router = Router();

router.use(protect);
router.get("/", validate(paginationSchema, "query"), getRecommendations);
router.post("/", createRecommendation);

export default router;
