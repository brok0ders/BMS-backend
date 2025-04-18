import { Router } from "express";

import {
  getAllMasterLiquors,
  insertManyLiquors,
  getLiquorByBrand,
  getLiquorByCompany,
  rmEX0,
} from "../controllers/masterLiquorController.js";

const router = Router();

router.route("/all").get(getAllMasterLiquors);
router.route("/brand/:brand").get(getLiquorByBrand);
router.route("/company/:companyId").get(getLiquorByCompany);
router.route("/rm0").delete(rmEX0);

router.route("/insert-many").post(insertManyLiquors);

export default router;
