import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

import {
    sendOtp,
    verifyOtp
} from "../services/otp.service.js";

const createError = (
    statusCode,
    message
) => {
    const error =
        new Error(message);

    error.statusCode =
        statusCode;

    return error;
};

const generateRefreshAccessToken =
    async (userId) => {
        const user =
            await User.findById(
                userId
            );

        if (!user) {
            throw createError(
                404,
                "User with id does not exist"
            );
        }

        if (!user.isActive) {
            throw createError(
                403,
                "User account is inactive"
            );
        }

        const accessToken =
            user.generateAccessToken();

        const refreshToken =
            user.generateRefreshToken();

        user.refreshToken =
            refreshToken;

        await user.save({
            validateBeforeSave: false
        });

        return {
            accessToken,
            refreshToken
        };
    };

const cookieOptions = {
    httpOnly: true,

    secure:
        process.env.NODE_ENV ===
        "production",

    sameSite: "lax"
};

const otpCookieOptions = {
    httpOnly: true,

    secure:
        process.env.NODE_ENV ===
        "production",

    sameSite: "lax",

    maxAge:
        10 * 60 * 1000
};

const generateOtpVerificationToken =
    (userId) => {
        if (
            !process.env.OTP_TOKEN_SECRET
        ) {
            throw new Error(
                "OTP_TOKEN_SECRET is not configured"
            );
        }

        return jwt.sign(
            {
                _id: userId,
                purpose: "OTP_VERIFICATION"
            },
            process.env
                .OTP_TOKEN_SECRET,
            {
                expiresIn:
                    process.env
                        .OTP_TOKEN_EXPIRY ||
                    "10m"
            }
        );
    };

const verifyOtpVerificationToken =
    (token) => {
        try {
            if (
                !process.env
                    .OTP_TOKEN_SECRET
            ) {
                throw new Error(
                    "OTP_TOKEN_SECRET is not configured"
                );
            }

            const decoded =
                jwt.verify(
                    token,
                    process.env
                        .OTP_TOKEN_SECRET
                );

            if (
                decoded.purpose !==
                "OTP_VERIFICATION"
            ) {
                throw createError(
                    401,
                    "Invalid OTP verification session"
                );
            }

            return decoded;
        } catch (error) {
            if (
                error.statusCode
            ) {
                throw error;
            }

            throw createError(
                401,
                "OTP verification session is invalid or expired"
            );
        }
    };

const setAuthenticationCookies =
    (
        res,
        accessToken,
        refreshToken
    ) => {
        return res
            .cookie(
                "accessToken",
                accessToken,
                cookieOptions
            )
            .cookie(
                "refreshToken",
                refreshToken,
                cookieOptions
            );
    };

const refreshAccessToken =
    async (
        req,
        res
    ) => {
        const incomingRefreshToken =
            req.cookies
                ?.refreshToken ||
            req.body
                ?.refreshToken;

        if (!incomingRefreshToken) {
            throw createError(
                401,
                "Unauthorized request"
            );
        }

        try {
            const decodedToken =
                jwt.verify(
                    incomingRefreshToken,
                    process.env
                        .REFRESH_TOKEN_SECRET
                );

            const user =
                await User.findById(
                    decodedToken?._id
                ).select(
                    "+refreshToken"
                );

            if (!user) {
                throw createError(
                    401,
                    "Invalid refresh token"
                );
            }

            if (!user.isActive) {
                throw createError(
                    403,
                    "User account is inactive"
                );
            }

            if (
                incomingRefreshToken !==
                user.refreshToken
            ) {
                throw createError(
                    401,
                    "Refresh token is expired or has already been used"
                );
            }

            const {
                accessToken,
                refreshToken
            } =
                await generateRefreshAccessToken(
                    user._id
                );

            return setAuthenticationCookies(
                res,
                accessToken,
                refreshToken
            )
                .status(200)
                .json({
                    message:
                        "Access token refreshed successfully"
                });
        } catch (error) {
            if (
                error.statusCode
            ) {
                throw error;
            }

            throw createError(
                401,
                "Invalid or expired refresh token"
            );
        }
    };

const registerUser =
    async (
        req,
        res
    ) => {
        const {
            role,
            station,
            email,
            name,
            password
        } = req.body || {};

        if (
            !name?.trim() ||
            !email?.trim() ||
            !role?.trim() ||
            !password?.trim()
        ) {
            throw createError(
                400,
                "Name, email, role and password are required"
            );
        }

        const validRoles = [
            "NCPOR Operator",
            "Station Manager",
            "Logistics Manager"
        ];

        if (
            !validRoles.includes(
                role
            )
        ) {
            throw createError(
                400,
                "Invalid role"
            );
        }

        if (
            role !==
                "NCPOR Operator" &&
            !station
        ) {
            throw createError(
                400,
                "Station is required for this role"
            );
        }

        if (
            role ===
                "NCPOR Operator" &&
            station
        ) {
            throw createError(
                400,
                "NCPOR Operator cannot be assigned to a station"
            );
        }

        const normalizedStation =
            station
                ?.trim()
                .toUpperCase();

        if (
            normalizedStation &&
            ![
                "MAITRI",
                "BHARATI"
            ].includes(
                normalizedStation
            )
        ) {
            throw createError(
                400,
                "Invalid station. Use MAITRI or BHARATI"
            );
        }

        const normalizedEmail =
            email
                .trim()
                .toLowerCase();

        const existedUser =
            await User.findOne({
                $or: [
                    {
                        name:
                            name.trim()
                    },
                    {
                        email:
                            normalizedEmail
                    }
                ]
            });

        if (existedUser) {
            throw createError(
                409,
                "User with this name or email already exists"
            );
        }

        const user =
            await User.create({
                name:
                    name.trim(),

                email:
                    normalizedEmail,

                password,

                role,

                station:
                    role ===
                    "NCPOR Operator"
                        ? undefined
                        : normalizedStation,

                authProvider:
                    "LOCAL"
            });

        const otpSessionToken =
            generateOtpVerificationToken(
                user._id
            );

        await sendOtp(
            user._id
        );

        return res
            .cookie(
                "otpVerificationToken",
                otpSessionToken,
                otpCookieOptions
            )
            .status(201)
            .json({
                message:
                    "User registered successfully. OTP sent for verification.",

                requiresOtp:
                    true,

                userId:
                    user._id
            });
    };

const loginUser =
    async (
        req,
        res
    ) => {
        const {
            name,
            email,
            password
        } = req.body || {};

        if (
            (!name && !email) ||
            !password
        ) {
            throw createError(
                400,
                "Name/email and password are required"
            );
        }

        const conditions = [];

        if (name) {
            conditions.push({
                name:
                    name.trim()
            });
        }

        if (email) {
            conditions.push({
                email:
                    email
                        .trim()
                        .toLowerCase()
            });
        }

        const user =
            await User.findOne({
                $or: conditions
            }).select(
                "+password"
            );

        if (!user) {
            throw createError(
                404,
                "User not found"
            );
        }

        if (!user.isActive) {
            throw createError(
                403,
                "User account is inactive"
            );
        }

        if (
            user.authProvider ===
                "GOOGLE" &&
            !user.password
        ) {
            throw createError(
                400,
                "This account uses Google login. Please continue with Google."
            );
        }

        const isPasswordValid =
            await user.isPasswordCorrect(
                password
            );

        if (!isPasswordValid) {
            throw createError(
                401,
                "Invalid credentials"
            );
        }

        const otpSessionToken =
            generateOtpVerificationToken(
                user._id
            );

        await sendOtp(
            user._id
        );

        return res
            .cookie(
                "otpVerificationToken",
                otpSessionToken,
                otpCookieOptions
            )
            .status(200)
            .json({
                message:
                    "Credentials verified. OTP sent successfully.",

                requiresOtp:
                    true
            });
    };

const verifyLoginOtp =
    async (
        req,
        res
    ) => {
        const otp =
            req.body?.otp;

        if (!otp) {
            throw createError(
                400,
                "OTP is required"
            );
        }

        const otpSessionToken =
            req.cookies
                ?.otpVerificationToken ||
            req.body
                ?.otpVerificationToken;

        if (!otpSessionToken) {
            throw createError(
                401,
                "OTP verification session not found"
            );
        }

        const decoded =
            verifyOtpVerificationToken(
                otpSessionToken
            );

        await verifyOtp(
            decoded._id,
            otp
        );

        const {
            accessToken,
            refreshToken
        } =
            await generateRefreshAccessToken(
                decoded._id
            );

        const loggedInUser =
            await User.findById(
                decoded._id
            ).select(
                "-password -refreshToken -otp"
            );

        if (!loggedInUser) {
            throw createError(
                404,
                "User not found"
            );
        }

        return res
            .cookie(
                "accessToken",
                accessToken,
                cookieOptions
            )
            .cookie(
                "refreshToken",
                refreshToken,
                cookieOptions
            )
            .clearCookie(
                "otpVerificationToken",
                otpCookieOptions
            )
            .status(200)
            .json({
                message:
                    "OTP verified. User logged in successfully.",

                user:
                    loggedInUser
            });
    };

const resendLoginOtp =
    async (
        req,
        res
    ) => {
        const otpSessionToken =
            req.cookies
                ?.otpVerificationToken ||
            req.body
                ?.otpVerificationToken;

        if (!otpSessionToken) {
            throw createError(
                401,
                "OTP verification session not found"
            );
        }

        const decoded =
            verifyOtpVerificationToken(
                otpSessionToken
            );

        const result =
            await sendOtp(
                decoded._id
            );

        return res.status(200).json({
            message:
                "OTP resent successfully",

            ...result
        });
    };

const googleOAuthCallback =
    async (
        req,
        res
    ) => {
        try {
            const user =
                req.user;

            if (!user) {
                throw createError(
                    401,
                    "Google authentication failed"
                );
            }

            if (!user.isActive) {
                throw createError(
                    403,
                    "User account is inactive"
                );
            }

            const otpSessionToken =
                generateOtpVerificationToken(
                    user._id
                );

            await sendOtp(
                user._id
            );

            return res
                .cookie(
                    "otpVerificationToken",
                    otpSessionToken,
                    otpCookieOptions
                )
                .redirect(
                    `${process.env.FRONTEND_URL}/verify-otp`
                );
        } catch (error) {
            console.error(
                "Google OAuth Error:",
                error
            );

            return res.redirect(
                `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
            );
        }
    };

const logoutUser =
    async (
        req,
        res
    ) => {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                }
            }
        );

        return res
            .clearCookie(
                "accessToken",
                cookieOptions
            )
            .clearCookie(
                "refreshToken",
                cookieOptions
            )
            .clearCookie(
                "otpVerificationToken",
                otpCookieOptions
            )
            .status(200)
            .json({
                message:
                    "User logged out successfully"
            });
    };

const getUserById =
    async (
        req,
        res
    ) => {
        const {
            id
        } = req.params;

        const user =
            await User.findById(
                id
            ).select(
                "-password -refreshToken -otp"
            );

        if (!user) {
            throw createError(
                404,
                "User not found"
            );
        }

        return res.status(200).json({
            message:
                "User fetched successfully",
            user
        });
    };

const getCurrentUser =
    async (
        req,
        res
    ) => {
        const user =
            await User.findById(
                req.user._id
            ).select(
                "-password -refreshToken -otp"
            );

        if (!user) {
            throw createError(
                404,
                "User not found"
            );
        }

        return res.status(200).json({
            message:
                "Current user fetched successfully",
            user
        });
    };

export {
    loginUser,
    logoutUser,
    registerUser,
    getUserById,
    getCurrentUser,
    refreshAccessToken,
    googleOAuthCallback,
    verifyLoginOtp,
    resendLoginOtp
};