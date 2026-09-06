import { Router } from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    getUserById,
    getCurrentUser,
    refreshAccessToken,
    googleOAuthCallback,
    verifyLoginOtp,
    resendLoginOtp
} from "../controllers/user.controller.js";

import {
    verifyJwt
} from "../middlewares/auth.middleware.js";

import passport from "passport";

const router = Router();

router.post(
    "/register",
    registerUser
);

router.post(
    "/login",
    loginUser
);

router.post(
    "/verify-otp",
    verifyLoginOtp
);

router.post(
    "/resend-otp",
    resendLoginOtp
);

router.post(
    "/refresh-token",
    refreshAccessToken
);

router.get(
    "/google",
    passport.authenticate(
        "google",
        {
            scope: [
                "profile",
                "email"
            ],
            session: false
        }
    )
);

router.get(
    "/google/callback",
    passport.authenticate(
        "google",
        {
            session: false,
            failureRedirect:
                `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
        }
    ),
    googleOAuthCallback
);

router.post(
    "/logout",
    verifyJwt,
    logoutUser
);

router.get(
    "/current-user",
    verifyJwt,
    getCurrentUser
);

router.get(
    "/:id",
    verifyJwt,
    getUserById
);

export default router;