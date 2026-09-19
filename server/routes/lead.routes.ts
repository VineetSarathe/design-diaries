import { Router } from "express";
import { createLead, exportLeads, listLeads } from "../controllers/lead.controller";
import { requireAdmin } from "../middleware/auth";
import { leadFileUpload } from "../middleware/upload";

const router = Router();

router.post("/leads", leadFileUpload, createLead);
router.get("/leads/export", requireAdmin, exportLeads);
router.get("/leads", requireAdmin, listLeads);

export default router;
