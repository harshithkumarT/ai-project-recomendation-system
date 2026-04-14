import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import profileRoutes from "./profileRoutes.js";
import projectRoutes from "./projectRoutes.js";
import recommendationRoutes from "./recommendationRoutes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/projects", projectRoutes);
router.use("/recommend", recommendationRoutes);
router.use("/admin", adminRoutes);

export default router;
