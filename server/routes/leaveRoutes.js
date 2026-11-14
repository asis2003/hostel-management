import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  getLeaveById,
  updateLeave,
  verifyPass,
} from "../controllers/leaveController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, applyLeave).get(protect, admin, getAllLeaves);
router.route("/my").get(protect, getMyLeaves);
router.route("/verify/:passCode").get(verifyPass); // Public for watchman
router.route("/:id").get(protect, getLeaveById).put(protect, admin, updateLeave);

export default router;