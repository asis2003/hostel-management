import express from "express";
import {
  raiseComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  submitFeedback,
} from "../controllers/complaintController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, raiseComplaint).get(protect, admin, getAllComplaints);
router.route("/my").get(protect, getMyComplaints);
router.route("/:id").get(protect, getComplaintById).put(protect, admin, updateComplaint);
router.route("/:id/feedback").put(protect, submitFeedback);

export default router;