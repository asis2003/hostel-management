import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";
import { withId, withIds } from "../lib/mapId.js";

// @desc    Raise a new complaint
// @route   POST /api/complaints
// @access  Private
const raiseComplaint = asyncHandler(async (req, res) => {
  const { roomNo, blockNo, category, title, description } = req.body;

  if (!roomNo || !category || !title || !description) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const complaint = await prisma.complaint.create({
    data: {
      roomNo: String(roomNo),
      blockNo: blockNo ? String(blockNo) : null,
      category,
      title,
      description,
      status: "Pending",
      raisedBy: req.user.id,
      raisedByName: req.user.name,
    },
  });

  res.status(201).json(withId(complaint));
});

// @desc    Get my complaints
// @route   GET /api/complaints/my
// @access  Private
const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await prisma.complaint.findMany({
    where: { raisedBy: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(withIds(complaints));
});

// @desc    Get all complaints (Admin)
// @route   GET /api/complaints
// @access  Private/Admin
const getAllComplaints = asyncHandler(async (req, res) => {
  const { status, category } = req.query;

  const where = {};
  if (status) where.status = status;
  if (category) where.category = category;

  const complaints = await prisma.complaint.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  res.json(withIds(complaints));
});

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await prisma.complaint.findUnique({
    where: { id: req.params.id },
  });

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  // Only owner or admin can view
  if (complaint.raisedBy !== req.user.id && !req.user.isAdmin) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.json(withId(complaint));
});

// @desc    Update complaint (status, assign, resolution note)
// @route   PUT /api/complaints/:id
// @access  Private/Admin
const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await prisma.complaint.findUnique({
    where: { id: req.params.id },
  });

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  const updated = await prisma.complaint.update({
    where: { id: req.params.id },
    data: {
      status: req.body.status || complaint.status,
      assignedTo: req.body.assignedTo !== undefined ? req.body.assignedTo : complaint.assignedTo,
      resolutionNote: req.body.resolutionNote !== undefined ? req.body.resolutionNote : complaint.resolutionNote,
    },
  });

  res.json(withId(updated));
});

// @desc    Submit feedback (only when Resolved)
// @route   PUT /api/complaints/:id/feedback
// @access  Private
const submitFeedback = asyncHandler(async (req, res) => {
  const { feedbackRating, feedbackComment } = req.body;

  const complaint = await prisma.complaint.findUnique({
    where: { id: req.params.id },
  });

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  if (complaint.raisedBy !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  if (complaint.status !== "Resolved") {
    res.status(400);
    throw new Error("Feedback can only be given after complaint is Resolved");
  }

  if (!feedbackRating || feedbackRating < 1 || feedbackRating > 5) {
    res.status(400);
    throw new Error("Rating must be between 1 and 5");
  }

  const updated = await prisma.complaint.update({
    where: { id: req.params.id },
    data: {
      feedbackRating: Number(feedbackRating),
      feedbackComment: feedbackComment || null,
    },
  });

  res.json(withId(updated));
});

export {
  raiseComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  submitFeedback,
};