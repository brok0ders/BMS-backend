import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createLiquor, deleteLiquor, getallLiquors, getLiqcom, getLiquor, updateLiquor } from "../controllers/liquorController.js";


const router = Router();

router.route("/all").get(verifyJWT, getallLiquors);
router.route("/:id").get(verifyJWT, getLiquor);
router.route("/company/:com").get(verifyJWT, getLiqcom);
router.route("/new").post(verifyJWT, createLiquor);
router.route("/edit/:id").put(verifyJWT, updateLiquor);
router.route("/delete/:id").delete(verifyJWT, deleteLiquor);

export default router;