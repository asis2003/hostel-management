import express from "express";
import {
  getMenuByWeek,
  getAllMenus,
  updateMenu,
} from "../controllers/menuController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAllMenus);
router
  .route("/:week")
  .get(protect, getMenuByWeek)
  .put(protect, admin, updateMenu);

export default router;