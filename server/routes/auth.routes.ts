import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controller";
import { optionalAdmin } from "../middleware/auth";

const router = Router();

router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/auth/me", optionalAdmin, me);

export default router;
