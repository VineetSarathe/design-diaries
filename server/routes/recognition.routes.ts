import { Router } from "express";
import {
  createRecognition,
  deleteRecognition,
  getRecognition,
  listRecognitions,
  reorderRecognitions,
  updateRecognition,
} from "../controllers/recognition.controller";
import { optionalAdmin, requireAdmin } from "../middleware/auth";
import { recognitionImageUpload } from "../middleware/upload";

const router = Router();

router.get("/recognitions", optionalAdmin, listRecognitions);
router.put("/recognitions/reorder", requireAdmin, reorderRecognitions);
router.get("/recognitions/:id", optionalAdmin, getRecognition);
router.post("/recognitions", requireAdmin, recognitionImageUpload, createRecognition);
router.put("/recognitions/:id", requireAdmin, recognitionImageUpload, updateRecognition);
router.delete("/recognitions/:id", requireAdmin, deleteRecognition);

export default router;
