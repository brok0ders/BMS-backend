import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import liquorRoutes from "./routes/liquorRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import beerRoutes from "./routes/beerRoutes.js";
import customerRoutes from "./routes/customerRoutes.js"
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
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/beer", beerRoutes);
app.use("/api/v1/customer", customerRoutes);

export default app;
