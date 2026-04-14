import { Router } from "express";
import { login, logout, refresh, register } from "../../controllers/authController.js";
import { protect } from "../../middlewares/authMiddleware.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";
import { validate } from "../../middlewares/validate.js";
import { loginSchema, registerSchema } from "../../validators/authValidator.js";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", protect, logout);

export default router;
