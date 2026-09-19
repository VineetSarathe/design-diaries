import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getBlog,
  listBlogs,
  reorderBlogs,
  updateBlog,
} from "../controllers/blog.controller";
import { optionalAdmin, requireAdmin } from "../middleware/auth";
import { blogImageUpload } from "../middleware/upload";

const router = Router();

router.get("/blogs", optionalAdmin, listBlogs);
router.put("/blogs/reorder", requireAdmin, reorderBlogs);
router.get("/blogs/:slug", optionalAdmin, getBlog);
router.post("/blogs", requireAdmin, blogImageUpload, createBlog);
router.put("/blogs/:id", requireAdmin, blogImageUpload, updateBlog);
router.delete("/blogs/:id", requireAdmin, deleteBlog);

export default router;
