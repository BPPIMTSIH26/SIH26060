import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserById,
    getCurrentUser,
    refreshAccessToken
} from "../controllers/user.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

router.post("/logout", verifyJwt, logoutUser);
router.get("/current-user", verifyJwt, getCurrentUser);
router.get("/:id", verifyJwt, getUserById);

export default router;