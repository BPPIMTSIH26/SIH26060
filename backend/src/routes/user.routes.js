import { Router } from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    getUserById,
    getCurrentUser,
    refreshAccessToken,
    googleOAuthCallback
} from "../controllers/user.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();

// Local authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// Token management
router.post("/refresh-token", refreshAccessToken);

// Google OAuth
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
    }),
    googleOAuthCallback
);

// Protected routes
router.post("/logout", verifyJwt, logoutUser);
router.get("/current-user", verifyJwt, getCurrentUser);
router.get("/:id", verifyJwt, getUserById);

export default router;