import { Router } from "express";
import { authoriseRoles, verifyJWT } from "../middleware/auth.middleware.js";
import { createUser, deleteUser, getallUsers, getUser, loginUser, updateUser } from "../controllers/userControllers.js";

const router = Router();

// router.route("/register").post(authoriseRoles("admin"), createUser);
router.route("/register").post(createUser);
router.route("/login").post(loginUser);

router.route("/all").get(verifyJWT, authoriseRoles("admin"), getallUsers);
router.route("/details").get(verifyJWT, getUser);
router.route("/update/").put(verifyJWT, updateUser);
// router.route("/delete/").delete(verifyJWT, authoriseRoles("admin"), deleteUser);
router.route("/delete/").delete(verifyJWT, deleteUser);

export default router;