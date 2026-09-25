import { Router } from "express";
import { health } from "../controllers/health.controller";
import authRoutes from "./auth.routes";
import leadRoutes from "./lead.routes";
import contactSettingsRoutes from "./contact-settings.routes";
import homepageSettingsRoutes from "./homepage-settings.routes";
import testimonialRoutes from "./testimonial.routes";
import clientLogoRoutes from "./client-logo.routes";
import aboutSettingsRoutes from "./about-settings.routes";
import projectRoutes from "./project.routes";
import recognitionRoutes from "./recognition.routes";
import blogRoutes from "./blog.routes";
import instagramFeedRoutes from "./instagram-feed.routes";
import callBookingRoutes from "./call-booking.routes";
import pageSeoRoutes from "./page-seo.routes";
import redirectRoutes from "./redirect.routes";
import adminAccountsRoutes from "./admin-accounts.routes";

const router = Router();

router.get("/health", health);
router.use(authRoutes);
router.use(leadRoutes);
router.use(contactSettingsRoutes);
router.use(homepageSettingsRoutes);
router.use(testimonialRoutes);
router.use(clientLogoRoutes);
router.use(aboutSettingsRoutes);
router.use(projectRoutes);
router.use(recognitionRoutes);
router.use(blogRoutes);
router.use(instagramFeedRoutes);
router.use(callBookingRoutes);
router.use(pageSeoRoutes);
router.use(redirectRoutes);
router.use(adminAccountsRoutes);

export default router;
