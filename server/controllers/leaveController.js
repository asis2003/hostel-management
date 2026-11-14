import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";
import { withId, withIds } from "../lib/mapId.js";

// Generate short unique pass code
const generatePassCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @desc    Apply for Leave / Outing
// @route   POST /api/leaves
// @access  Private
const applyLeave = asyncHandler(async (req, res) => {
  const {
    roomNo,
    studentName,
    type,
    startDate,
    endDate,
    reason,
    parentName,
    parentContact,
  } = req.body;

  if (!roomNo || !studentName || !startDate || !endDate || !reason || !parentName || !parentContact) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  if (!/^\d{10}$/.test(parentContact)) {
    res.status(400);
    throw new Error("Parent contact must be 10 digits");
  }

  const leave = await prisma.leave.create({
    data: {
      roomNo: String(roomNo),
      studentName,
      type: type || "Leave",
      startDate,
      endDate,
      reason,
      parentName,
      parentContact: String(parentContact),
      status: "Pending",
      raisedBy: req.user.id,
    },
  });

  res.status(201).json(withId(leave));
});

// @desc    Get my leave history
// @route   GET /api/leaves/my
// @access  Private
const getMyLeaves = asyncHandler(async (req, res) => {
  const leaves = await prisma.leave.findMany({
    where: { raisedBy: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(withIds(leaves));
});

// @desc    Get all leave requests (Admin)
// @route   GET /api/leaves
// @access  Private/Admin
const getAllLeaves = asyncHandler(async (req, res) => {
  const { status, type } = req.query;

  const where = {};
  if (status) where.status = status;
  if (type) where.type = type;

  const leaves = await prisma.leave.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  res.json(withIds(leaves));
});

// @desc    Get single leave
// @route   GET /api/leaves/:id
// @access  Private
const getLeaveById = asyncHandler(async (req, res) => {
  const leave = await prisma.leave.findUnique({
    where: { id: req.params.id },
  });

  if (!leave) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  if (leave.raisedBy !== req.user.id && !req.user.isAdmin) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.json(withId(leave));
});

// @desc    Approve / Reject leave
// @route   PUT /api/leaves/:id
// @access  Private/Admin
const updateLeave = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;

  const leave = await prisma.leave.findUnique({
    where: { id: req.params.id },
  });

  if (!leave) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  if (!["Approved", "Rejected"].includes(status)) {
    res.status(400);
    throw new Error("Status must be Approved or Rejected");
  }

  let passCode = leave.passCode;

  // Generate pass code only when Approved
  if (status === "Approved" && !passCode) {
    passCode = generatePassCode();

    // Make sure it's unique
    let exists = await prisma.leave.findFirst({ where: { passCode } });
    while (exists) {
      passCode = generatePassCode();
      exists = await prisma.leave.findFirst({ where: { passCode } });
    }
  }

  const updated = await prisma.leave.update({
    where: { id: req.params.id },
    data: {
      status,
      adminNote: adminNote !== undefined ? adminNote : leave.adminNote,
      passCode: status === "Approved" ? passCode : null,
      approvedBy: req.user.id,
    },
  });

  res.json(withId(updated));
});

// @desc    Verify pass code (for Watchman)
// @route   GET /api/leaves/verify/:passCode
// @access  Public
const verifyPass = asyncHandler(async (req, res) => {
  const leave = await prisma.leave.findFirst({
    where: {
      passCode: req.params.passCode,
      status: "Approved",
    },
  });

  if (!leave) {
    res.status(404);
    throw new Error("Invalid or expired pass code");
  }

  res.json(withId(leave));
});

export {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  getLeaveById,
  updateLeave,
  verifyPass,
};