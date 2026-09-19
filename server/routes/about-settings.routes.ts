import { Router } from "express";
import { getAboutSettings, updateAboutSettings } from "../controllers/about-settings.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/settings/about", getAboutSettings);
router.put("/settings/about", requireAdmin, updateAboutSettings);

export default router;
