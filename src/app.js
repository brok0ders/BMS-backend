import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import liquorRoutes from "./routes/liquorRoutes.js";
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
app.use("/api/v1/liquor", liquorRoutes);

export default app;
