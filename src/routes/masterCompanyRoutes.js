import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getAllMasterCompanies,
  insertManyCompanies,
} from "../controllers/masterCompanyController.js";

const router = Router();

router.route("/all").get(getAllMasterCompanies);
router.route("/insert-many").post(insertManyCompanies);

export default router;
