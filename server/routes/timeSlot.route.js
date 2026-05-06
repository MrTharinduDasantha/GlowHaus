// Time-slot route — public read used by the booking flow's date/time picker.
// GET /api/time-slots?stylistId=...&date=YYYY-MM-DD&serviceIds=id1,id2

import express from "express";
import { getAvailableSlots } from "../controllers/timeSlot.controller.js";

const router = express.Router();

router.get("/", getAvailableSlots);

export default router;
