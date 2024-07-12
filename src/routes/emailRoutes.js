import express from "express";
import router from express.Router();

const { sendEmail } = require("../controllers/emailControllers");

router.post("/sendEmail", sendEmail);

module.exports = router;
