import { Router } from "express";

import {
  getAllMasterBeers,
  insertManyBeers,
} from "../controllers/masterBeerController.js";

const router = Router();

router.route("/all").get(getAllMasterBeers);
router.route("/insert-many").post(insertManyBeers);

export default router;
