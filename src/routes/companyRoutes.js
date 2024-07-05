import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import {
  getCompanyById,
  getAllCompany,
  updateCompany,
  deleteCompany,
  createCompany,
} from "../controllers/companyController";

const router = Router();

router.route("/:id").get(verifyJWT, getCompanyById);
router.route("/all").get(verifyJWT, getAllCompany);
router.route("/create").post(verifyJWT, createCompany);
router.route("/update/:id").put(verifyJWT, updateCompany);
router.route("/delete/:id").delete(verifyJWT, deleteCompany);

export { router };
