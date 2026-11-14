
import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";
import { withId, withIds } from "../lib/mapId.js";

const addStudent = asyncHandler(async (req, res) => {
  const {
    studentId,
    name,
    address,
    category,
    city,
    contact,
    fatherContact,
    image,
    roomNo,
    blockNo,
    status,
  } = req.body;

  const studentExist = await prisma.student.findFirst({
    where: {
      OR: [
        { name },
        { studentId: String(studentId) },
      ],
    },
  });

  if (studentExist) {
    res.status(400);
    throw new Error("Student already exists");
  }

  const student = await prisma.student.create({
    data: {
      studentId: String(studentId),
      name,
      address,
      category,
      city,
      contact: String(contact),
      fatherContact: String(fatherContact),
      image,
      roomNo: String(roomNo),
      blockNo: String(blockNo),
      status,
    },
  });

  if (student) {
    res.status(201).json(withId(student));
  } else {
    res.status(400);
    throw new Error("Invalid Student data");
  }
});

const updateStudentProfile = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: req.body._id || req.body.id },
  });

  if (student) {
    const updatedStudent = await prisma.student.update({
      where: { id: student.id },
      data: {
        studentId: req.body.studentId
          ? String(req.body.studentId)
          : student.studentId,
        name: req.body.name || student.name,
        address: req.body.address || student.address,
        category: req.body.category || student.category,
        city: req.body.city || student.city,
        contact: req.body.contact
          ? String(req.body.contact)
          : student.contact,
        fatherContact: req.body.fatherContact
          ? String(req.body.fatherContact)
          : student.fatherContact,
        image: req.body.image || student.image,
        roomNo: req.body.roomNo
          ? String(req.body.roomNo)
          : student.roomNo,
        blockNo: req.body.blockNo
          ? String(req.body.blockNo)
          : student.blockNo,
        status: req.body.status || student.status,
      },
    });

    res.json(withId(updatedStudent));
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});

const getAllStudents = asyncHandler(async (req, res) => {
  const pageSize = 15;
  const page = Number(req.query.pageNumber) || 1;

  const where = req.query.keyword
    ? {
        name: {
          contains: req.query.keyword,
          mode: "insensitive",
        },
      }
    : {};

  const count = await prisma.student.count({ where });

  const students = await prisma.student.findMany({
    where,
    take: pageSize,
    skip: pageSize * (page - 1),
    orderBy: { createdAt: "desc" },
  });

  if (students && students.length !== 0) {
    res.json({
      students: withIds(students),
      page,
      pages: Math.ceil(count / pageSize),
    });
  } else {
    res.status(404);
    throw new Error("No Students Found");
  }
});

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: req.params.id },
  });

  if (student) {
    await prisma.student.delete({ where: { id: student.id } });
    res.json({ message: "Student removed" });
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});

const getStudentById = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: req.params.id },
  });

  if (student) {
    res.json(withId(student));
  } else {
    res.status(404);
    throw new Error("Students not found");
  }
});

const getStudentByRoomNo = asyncHandler(async (req, res) => {
  const today = new Date().toString().substring(0, 15);

  const attendance = await prisma.attendance.findFirst({
    where: {
      date: today,
      roomNo: { has: req.params.roomId },
    },
  });

  const students = await prisma.student.findMany({
    where: { roomNo: req.params.roomId },
  });

  if (students.length > 0) {
    if (attendance) {
      res.json({
        students: withIds(students),
        attendance: withId(attendance),
      });
    } else {
      res.json({ students: withIds(students) });
    }
  } else {
    res.status(404);
    throw new Error("Students not found");
  }
});

export {
  addStudent,
  updateStudentProfile,
  getAllStudents,
  deleteStudent,
  getStudentById,
  getStudentByRoomNo,
};
