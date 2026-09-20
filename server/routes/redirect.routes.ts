import { Router } from "express";
import {
  createRedirect,
  deleteRedirect,
  listPublicRedirects,
  listRedirects,
  updateRedirect,
} from "../controllers/redirect.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/redirects/public", listPublicRedirects);
router.get("/redirects", requireAdmin, listRedirects);
router.post("/redirects", requireAdmin, createRedirect);
router.put("/redirects/:id", requireAdmin, updateRedirect);
router.delete("/redirects/:id", requireAdmin, deleteRedirect);

export default router;
