import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";
import { withId } from "../lib/mapId.js";

const getAttendanceByRoomNo = asyncHandler(async (req, res) => {
  const date = req.body.date || new Date().toString().substring(0, 15);
  const roomNo = req.body.roomNo || req.params.roomId;

  const attendance = await prisma.attendance.findFirst({
    where: {
      roomNo: { has: String(roomNo) },
      date: date,
    },
  });

  if (attendance) {
    res.json(withId(attendance));
  } else {
    res.status(404);
    throw new Error(
      `You didn't take attendance today for room No:${roomNo}`
    );
  }
});

const getAttendance = asyncHandler(async (req, res) => {
  const date = req.body.date || new Date().toString().substring(0, 15);

  const attendance = await prisma.attendance.findFirst({
    where: { date },
  });

  if (attendance) {
    res.json(withId(attendance));
  } else {
    res.status(404);
    throw new Error(`You didn't take attendance ${date}!!`);
  }
});

const enterAttendanceByRoomNo = asyncHandler(async (req, res) => {
  const date = req.body.date || new Date().toString().substring(0, 15);
  const roomNo = String(req.body.roomNo);

  let attendance = await prisma.attendance.findFirst({
    where: { date },
  });

  if (attendance) {
    // Merge maps
    const dataTemp = { ...(attendance.data || {}), ...(req.body.data || {}) };
    const detailsTemp = {
      ...(attendance.details || {}),
      ...(req.body.details || {}),
    };

    // Ensure roomNo is in the array
    const roomNos = Array.isArray(attendance.roomNo)
      ? [...new Set([...attendance.roomNo, roomNo])]
      : [roomNo];

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        roomNo: roomNos,
        data: dataTemp,
        details: detailsTemp,
      },
    });

    res.json(withId(updatedAttendance));
  } else {
    const newAttendance = await prisma.attendance.create({
      data: {
        roomNo: [roomNo],
        date,
        data: req.body.data || {},
        details: req.body.details || {},
      },
    });
    res.json(withId(newAttendance));
  }
});

const deleteAttendanceByDays = asyncHandler(async (req, res) => {
  const days = Number(req.params.days);
  const deletionDate = new Date();
  deletionDate.setDate(deletionDate.getDate() - days);

  await prisma.attendance.deleteMany({
    where: {
      createdAt: { lt: deletionDate },
    },
  });

  res.json({ message: `Deleted Attendance for before past ${days} days` });
});

export {
  getAttendanceByRoomNo,
  enterAttendanceByRoomNo,
  getAttendance,
  deleteAttendanceByDays,
};
