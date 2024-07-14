import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createBill,
  deleteBill,
  getallBills,
  getAnalyticsData,
  getBill,
  getBillRevenueChart,
  getMonthlyData,
  getTopSellingBeers,
  getTopSellingLiquors,
  updateBill,
} from "../controllers/billController.js";

const router = Router();

router.route("/all/").get(verifyJWT, getallBills);
router.route("/:id").get(verifyJWT, getBill);
router.route("/new").post(verifyJWT, createBill);
router.route("/edit/:id").put(verifyJWT, updateBill);
router.route("/delete/:id").delete(verifyJWT, deleteBill);
router.route("/chart/revenue").get(verifyJWT, getBillRevenueChart);
router.route("/chart/top-beers").get(verifyJWT, getTopSellingBeers);
router.route("/chart/top-liquors").get(verifyJWT, getTopSellingLiquors);
router.route("/dashboard/analytics").get(verifyJWT, getAnalyticsData);
router.route("/analytics/monthly").get(verifyJWT, getMonthlyData);

export default router;
