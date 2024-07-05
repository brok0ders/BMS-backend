import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { createBill, deleteBill, getallBills, getBill, updateBill } from "../controllers/billController";


const router = Router();

router.route("/all").get(verifyJWT, getallBills);
router.route("/:id").get(verifyJWT, getBill);
router.route("/new").post(verifyJWT, createBill);
router.route("/edit").put(verifyJWT, updateBill);
router.route("/delete").get(verifyJWT, deleteBill);

export {router};