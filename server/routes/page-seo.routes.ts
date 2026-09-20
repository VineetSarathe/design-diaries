import { Router } from "express";
import { listPageSeo, updatePageSeo } from "../controllers/page-seo.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/page-seo", listPageSeo);
router.put("/page-seo/:key", requireAdmin, updatePageSeo);

export default router;
