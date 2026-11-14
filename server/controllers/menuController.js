import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";
import { withId } from "../lib/mapId.js";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyDay = () => ({
  teaCoffee: "",
  breakfast: "",
  lunch: "",
  snacks: "",
  dinner: "",
});

const defaultMenuData = () => {
  const data = {};
  DAYS.forEach((day) => {
    data[day] = emptyDay();
  });
  return data;
};

const getMenuByWeek = asyncHandler(async (req, res) => {
  const week = req.params.week || "Week 1";

  let menu = await prisma.menu.findUnique({ where: { week } });

  if (!menu) {
    menu = await prisma.menu.create({
      data: {
        week,
        data: defaultMenuData(),
      },
    });
  }

  res.json(withId(menu));
});

const getAllMenus = asyncHandler(async (req, res) => {
  const menus = await prisma.menu.findMany({
    select: { id: true, week: true, updatedAt: true },
    orderBy: { week: "asc" },
  });
  res.json(menus.map((m) => ({ ...m, _id: m.id })));
});

const updateMenu = asyncHandler(async (req, res) => {
  const week = req.params.week;
  const { data } = req.body;

  if (!data) {
    res.status(400);
    throw new Error("Menu data is required");
  }

  const menu = await prisma.menu.upsert({
    where: { week },
    update: { data },
    create: { week, data },
  });

  res.json(withId(menu));
});

export { getMenuByWeek, getAllMenus, updateMenu };