import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  reorderProjects,
  updateProject,
} from "../controllers/project.controller";
import { optionalAdmin, requireAdmin } from "../middleware/auth";
import { projectImageUpload } from "../middleware/upload";

const router = Router();

router.get("/projects", optionalAdmin, listProjects);
router.put("/projects/reorder", requireAdmin, reorderProjects);
router.get("/projects/:slug", optionalAdmin, getProject);
router.post("/projects", requireAdmin, projectImageUpload, createProject);
router.post("/projects/:id", requireAdmin, projectImageUpload, updateProject);
router.put("/projects/:id", requireAdmin, projectImageUpload, updateProject);
router.delete("/projects/:id", requireAdmin, deleteProject);

export default router;
