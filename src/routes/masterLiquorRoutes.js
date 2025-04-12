import { Router } from "express";

import {
  getAllMasterLiquors,
  insertManyLiquors,
  getLiquorByBrand,
  getLiquorByCompany,
} from "../controllers/masterLiquorController.js";

const router = Router();

router.route("/all").get(getAllMasterLiquors);
router.route("/brand/:brand").get(getLiquorByBrand);
router.route("/company/:companyId").get(getLiquorByCompany);

router.route("/insert-many").post(insertManyLiquors);

export default router;
