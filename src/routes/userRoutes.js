import { Router } from "express";
import { authoriseRoles, verifyJWT } from "../middleware/auth.middleware";
import { createUser, deleteUser, getallUsers, getUser, loginUser, updateUser } from "../controllers/userControllers";


const router = Router();

router.route("/register").post(authoriseRoles("admin"), createUser);
router.route("login").post(loginUser);

router.route("/all").get(verifyJWT, authoriseRoles("admin"), getallUsers);
router.route("/:id").get(verifyJWT, getUser);
router.route("/update/:id").put(verifyJWT, updateUser);
router.route("/delete/:id").delete(verifyJWT, authoriseRoles("admin"), deleteUser);

export default router;