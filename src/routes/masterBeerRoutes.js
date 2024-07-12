import { Router } from "express";

import {
  getAllMasterBeers,
  getBeerByBrand,
  insertManyBeers,
} from "../controllers/masterBeerController.js";

const router = Router();

router.route("/all").get(getAllMasterBeers);
router.route("/brand/:brand").get(getBeerByBrand);

router.route("/insert-many").post(insertManyBeers);

export default router;
