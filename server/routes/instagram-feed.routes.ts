import { Router } from "express";
import {
  createInstagramFeed,
  deleteInstagramFeed,
  getInstagramFeedItem,
  listInstagramFeed,
  reorderInstagramFeed,
  updateInstagramFeed,
} from "../controllers/instagram-feed.controller";
import { optionalAdmin, requireAdmin } from "../middleware/auth";
import { imageUpload } from "../middleware/upload";

const router = Router();

router.get("/instagram-feed", optionalAdmin, listInstagramFeed);
router.put("/instagram-feed/reorder", requireAdmin, reorderInstagramFeed);
router.get("/instagram-feed/:id", optionalAdmin, getInstagramFeedItem);
router.post("/instagram-feed", requireAdmin, imageUpload, createInstagramFeed);
router.put("/instagram-feed/:id", requireAdmin, imageUpload, updateInstagramFeed);
router.delete("/instagram-feed/:id", requireAdmin, deleteInstagramFeed);

export default router;
