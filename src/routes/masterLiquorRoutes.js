import { Router } from "express";

import {
  getAllMasterLiquors,
  insertManyLiquors,
  getLiquorByBrand,
} from "../controllers/masterLiquorController.js";

const router = Router();

router.route("/all").get(getAllMasterLiquors);
router.route("/brand/:brand").get(getLiquorByBrand);

router.route("/insert-many").post(insertManyLiquors);

export default router;
