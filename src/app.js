import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import emailRoutes from "./routes/emailRoutes";
import userRoutes from "./routes/userRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import liquorRoutes from "./routes/liquorRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import beerRoutes from "./routes/beerRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import masterCompanyRoutes from "./routes/masterCompanyRoutes.js";
import masterBeerRoutes from "./routes/masterBeerRoutes.js";
import masterLiquorRoutes from "./routes/masterLiquorRoutes.js";
import clRoutes from "./routes/CLRoutes.js";

const app = express();

app.use(
  cors({
    origin: [
      "https://6694f1a87ba0796a32336824--silver-naiad-b83629.netlify.app",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://bottlers.netlify.app",
    ],
  })
);
// //
// dotenv.config();

// const corsOptions = {
//   origin: "*",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/bill", billRoutes);
app.use("/api/v1/liquor", liquorRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/beer", beerRoutes);
app.use("/api/v1/CL", clRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/master-company", masterCompanyRoutes);
app.use("/api/v1/master-beer", masterBeerRoutes);
app.use("/api/v1/master-liquor", masterLiquorRoutes);
//Signup and login
// app.use("/api/v1/email", emailRoutes);

// app.use("api/v1/")

export default app;
