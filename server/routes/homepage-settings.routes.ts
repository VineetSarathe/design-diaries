import { Router } from "express";
import {
  getHomepageSettings,
  updateHomepageSettings,
} from "../controllers/homepage-settings.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/settings/homepage", getHomepageSettings);
router.put("/settings/homepage", requireAdmin, updateHomepageSettings);

export default router;
