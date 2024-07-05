import { Router } from "express";
import {
  createBeer,
  deleteBeer,
  getAllBeer,
  updateBeer,
  getBeerById,
} from "../controllers/beerController.js";

import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();

router.route("/all").get(verifyJWT, getAllBeer);
router.route("/:id").get(verifyJWT, getBeerById);
router.route("/create").post(verifyJWT, createBeer);
router.route("/update/:id").put(verifyJWT, updateBeer);
router.route("/delete/:id").delete(verifyJWT, deleteBeer);

export default router;