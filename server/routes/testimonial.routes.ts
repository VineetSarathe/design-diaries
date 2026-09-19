import { Router } from "express";
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonial,
  listTestimonials,
  updateTestimonial,
} from "../controllers/testimonial.controller";
import { optionalAdmin, requireAdmin } from "../middleware/auth";
import { testimonialImageUpload } from "../middleware/upload";

const router = Router();

router.get("/testimonials", optionalAdmin, listTestimonials);
router.get("/testimonials/:id", optionalAdmin, getTestimonial);
router.post("/testimonials", requireAdmin, testimonialImageUpload, createTestimonial);
router.put("/testimonials/:id", requireAdmin, testimonialImageUpload, updateTestimonial);
router.delete("/testimonials/:id", requireAdmin, deleteTestimonial);

export default router;
