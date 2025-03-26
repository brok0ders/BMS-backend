import {Router} from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createCL, getCL, updateCL } from "../controllers/clController.js";



const router= Router();

router.route("/all").get(verifyJWT, getCL);
router.route("/create").post(createCL);
router.route("/update/:id").put(verifyJWT,updateCL);

export default router;