// Favorite routes — customer-only.
// GET    /              — my favorites
// POST   /              — add a favorite (body: { serviceId })
// DELETE /:serviceId    — remove a favorite

import express from "express";
import {
  getMyFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favorite.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware); // customer must be logged in

router.get("/", getMyFavorites);
router.post("/", addFavorite);
router.delete("/:serviceId", removeFavorite);

export default router;
