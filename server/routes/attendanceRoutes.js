import express from "express";
import {
  deleteAttendanceByDays,
  enterAttendanceByRoomNo,
  getAttendance,
  getAttendanceByRoomNo,
} from "../controllers/attendanceController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Specific routes first
router.route("/getAnalysis").post(protect, getAttendance);
router.route("/").post(protect, admin, enterAttendanceByRoomNo);

// Parameterized routes last
router.route("/:roomId").get(protect, getAttendanceByRoomNo);
router.route("/:days").delete(protect, admin, deleteAttendanceByDays);

export default router;
