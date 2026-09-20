import { Router } from "express";
import {
  getContactSettings,
  getMailSettings,
  testMailSettings,
  updateContactSettings,
  updateMailSettings,
} from "../controllers/contact-settings.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/settings/contact", getContactSettings);
router.put("/settings/contact", requireAdmin, updateContactSettings);
router.get("/settings/mail", requireAdmin, getMailSettings);
router.put("/settings/mail", requireAdmin, updateMailSettings);
router.post("/settings/mail/test", requireAdmin, testMailSettings);

export default router;
