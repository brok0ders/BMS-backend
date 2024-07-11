import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createBill,
  deleteBill,
  getallBills,
  getBill,
  getBillRevenueChart,
  updateBill,
} from "../controllers/billController.js";

const router = Router();

router.route("/all/:sellerId").get(getallBills);
router.route("/:id").get(getBill);
router.route("/new").post(verifyJWT, createBill);
router.route("/edit/:id").put(verifyJWT, updateBill);
router.route("/delete/:id").delete(verifyJWT, deleteBill);
router.route("/chart/revenue").get(getBillRevenueChart);

export default router;
