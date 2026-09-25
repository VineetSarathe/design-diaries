import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import {
  createAdminAccount,
  deleteAdminAccount,
  listAdminAccounts,
  updateAdminAccount,
} from "../controllers/admin-accounts.controller";

const router = Router();

router.get("/admin-accounts", requireAdmin, listAdminAccounts);
router.post("/admin-accounts", requireAdmin, createAdminAccount);
router.put("/admin-accounts/:id", requireAdmin, updateAdminAccount);
router.delete("/admin-accounts/:id", requireAdmin, deleteAdminAccount);

export default router;
