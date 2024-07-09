import { Router } from "express";

import {
  getAllMasterLiquors,
  insertManyLiquors,
} from "../controllers/masterLiquorController.js";

const router = Router();

router.route("/all").get(getAllMasterLiquors);
router.route("/insert-many").post(insertManyLiquors);

export default router;
