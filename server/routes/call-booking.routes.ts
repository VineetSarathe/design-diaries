import { Router } from "express";
import { createCallBooking, getCallAvailability, getCallSettings, listCallBookings, updateCallSettings } from "../controllers/call-booking.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/call-availability", getCallAvailability);
router.post("/call-bookings", createCallBooking);
router.get("/call-bookings", requireAdmin, listCallBookings);
router.get("/call-settings", getCallSettings);
router.put("/call-settings", requireAdmin, updateCallSettings);

export default router;
