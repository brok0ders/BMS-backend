import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getCompanyById,
  getAllCompany,
  updateCompany,
  deleteCompany,
  createCompany,
} from "../controllers/companyController.js";

const router = Router();

router.route("/all").get(getAllCompany);
router.route("/:id").get(verifyJWT, getCompanyById);
router.route("/create").post(verifyJWT, createCompany);
router.route("/update/:id").put(verifyJWT, updateCompany);
router.route("/delete/:id").delete(verifyJWT, deleteCompany);

export default router;
