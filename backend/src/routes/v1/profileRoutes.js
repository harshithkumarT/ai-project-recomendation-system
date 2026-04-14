import { Router } from "express";
import { getMyProfile, upsertMyProfile } from "../../controllers/profileController.js";
import { protect } from "../../middlewares/authMiddleware.js";
import { validate } from "../../middlewares/validate.js";
import { profileSchema } from "../../validators/profileValidator.js";

const router = Router();

router.use(protect);
router.get("/", getMyProfile);
router.put("/", validate(profileSchema), upsertMyProfile);

export default router;
