import app from "./app.js";

import dotenv from "dotenv";
import cloudinary from "cloudinary";
import express from "express";
import connectDB from "./db/db.js";
dotenv.config();


const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    // Listening for error
    app.on("error", (error) => {
      console.log("Error in server!! \n\n", error);
    });

    app.listen(port, () => {
      console.log(`Server ⚙️ running on Port ${port}`);
    });
  })
  .catch((err) => {
    console.log(`ERROR: Error in mongoDb connecton!!`);
  });
