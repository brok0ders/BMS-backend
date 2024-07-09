import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createBill, deleteBill, getallBills, getBill, updateBill } from "../controllers/billController.js";


const router = Router();

router.route("/all/:sellerId").get(verifyJWT, getallBills);
router.route("/:id").get(verifyJWT, getBill);
router.route("/new").post(verifyJWT, createBill);
router.route("/edit/:id").put(verifyJWT, updateBill);
router.route("/delete/:id").delete(verifyJWT, deleteBill);

export default router;