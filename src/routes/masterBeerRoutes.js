import { Router } from "express";

import {
  getAllMasterBeers,
  getBeerByBrand,
  getBeersByCompany,
  insertManyBeers,
  rmEX0,
} from "../controllers/masterBeerController.js";

const router = Router();

router.route("/all").get(getAllMasterBeers);
router.route("/brand/:brand").get(getBeerByBrand);
router.route("/company/:companyId").get(getBeersByCompany);
router.route("/rm0").delete(rmEX0);

router.route("/insert-many").post(insertManyBeers);

export default router;
