import { Router } from "express";
import { authoriseRoles, verifyJWT } from "../middleware/auth.middleware.js";
import {
  createUser,
  deleteEmail,
  deleteUser,
  getallUsers,
  getUser,
  loginUser,
  updateUser,
} from "../controllers/userControllers.js";

const router = Router();

router.route("/register").post(createUser);
router.route("/login").post(loginUser);

router.route("/all").get(verifyJWT, authoriseRoles("user"), getallUsers);
router.route("/details").get(verifyJWT, getUser);
router.route("/update/").put(verifyJWT, updateUser);
router.route("/email/delete/").put(verifyJWT, deleteEmail);
router.route("/delete/").delete(verifyJWT, deleteUser);

export default router;
