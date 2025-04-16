import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomer,
  getCustomerById,
  getCustomerByShop,
  updateCustomer,
} from "../controllers/customerController.js";

const router = Router();

router.route("/all").get(verifyJWT, getAllCustomer);
router.route("/:id").get(verifyJWT, getCustomerById);
router.route("/details/:shop").get(verifyJWT, getCustomerByShop);
router.route("/create").post(verifyJWT, createCustomer);
router.route("/update/:id").put(verifyJWT, updateCustomer);
router.route("/delete").delete(verifyJWT, deleteCustomer);

export default router;