import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import billRoutes from "./routes/billRoutes.js";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/bill", billRoutes);

export default app;
