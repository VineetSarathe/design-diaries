import { Router } from "express";
import {
  getContactSettings,
  updateContactSettings,
} from "../controllers/contact-settings.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/settings/contact", getContactSettings);
router.put("/settings/contact", requireAdmin, updateContactSettings);

export default router;
