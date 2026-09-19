import { Router } from "express";
import {
  createClientLogo,
  deleteClientLogo,
  getClientLogo,
  listClientLogos,
  reorderClientLogos,
  updateClientLogo,
} from "../controllers/client-logo.controller";
import { optionalAdmin, requireAdmin } from "../middleware/auth";
import { imageUpload } from "../middleware/upload";

const router = Router();

router.get("/client-logos", optionalAdmin, listClientLogos);
router.put("/client-logos/reorder", requireAdmin, reorderClientLogos);
router.get("/client-logos/:id", optionalAdmin, getClientLogo);
router.post("/client-logos", requireAdmin, imageUpload, createClientLogo);
router.put("/client-logos/:id", requireAdmin, imageUpload, updateClientLogo);
router.delete("/client-logos/:id", requireAdmin, deleteClientLogo);

export default router;
