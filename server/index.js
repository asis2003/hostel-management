
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";

import path from "path";
import morgan from "morgan";
import dotenv from "dotenv";

import {
  errorHandler,
  notFound,
} from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Remove /api prefix when requests arrive through Vercel rewrites
app.use((req, res, next) => {
  if (req.url.startsWith("/api/")) {
    req.url = req.url.replace(/^\/api/, "");
  }
  next();
});

// API routes
app.use("/users", userRoutes);
app.use("/student", studentRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/menu", menuRoutes);
app.use("/complaints", complaintRoutes);
app.use("/leaves", leaveRoutes);

// Local development root
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.send("API is running.... (Neon Postgres + Prisma)");
  });
}

// API 404 and error handling
app.use(notFound);
app.use(errorHandler);

// Start local server only outside Vercel
const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
  });
}

export default app;
