import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const createError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const generateRefreshAccessToken = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw createError(
            404,
            "User with id does not exist"
        );
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

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
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
};

const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw createError(
            401,
            "Unauthorized request"
        );
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(
            decodedToken?._id
        ).select("+refreshToken");

        if (!user) {
            throw createError(
                401,
                "Invalid refresh token"
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
        } = await generateRefreshAccessToken(
            user._id
        );

        return res
            .status(200)
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
            .json({
                accessToken,
                refreshToken,
                message: "Access token refreshed successfully"
            });

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        throw createError(
            401,
            "Invalid or expired refresh token"
        );
    }
};

const registerUser = async (req, res) => {
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

    if (!validRoles.includes(role)) {
        throw createError(
            400,
            "Invalid role"
        );
    }

    if (
        role !== "NCPOR Operator" &&
        !station
    ) {
        throw createError(
            400,
            "Station is required for this role"
        );
    }

    if (
        role === "NCPOR Operator" &&
        station
    ) {
        throw createError(
            400,
            "NCPOR Operator cannot be assigned to a station"
        );
    }

    if (
        station &&
        !["MAITRI", "BHARATI"].includes(station)
    ) {
        throw createError(
            400,
            "Invalid station. Use MAITRI or BHARATI"
        );
    }

    const normalizedEmail = email
        .trim()
        .toLowerCase();

    const existedUser = await User.findOne({
        $or: [
            { name: name.trim() },
            { email: normalizedEmail }
        ]
    });

    if (existedUser) {
        throw createError(
            409,
            "User with this name or email already exists"
        );
    }

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role,
        station:
            role === "NCPOR Operator"
                ? undefined
                : station,
        authProvider: "LOCAL"
    });

    const {
        accessToken,
        refreshToken
    } = await generateRefreshAccessToken(
        user._id
    );

    const createdUser = await User.findById(
        user._id
    ).select("-password -refreshToken");

    if (!createdUser) {
        throw createError(
            500,
            "Error while registering the user"
        );
    }

    return res
        .status(201)
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
        .json({
            message: "User registered successfully",
            user: createdUser
        });
};

const loginUser = async (req, res) => {
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
            name: name.trim()
        });
    }

    if (email) {
        conditions.push({
            email: email.trim().toLowerCase()
        });
    }

    const user = await User.findOne({
        $or: conditions
    }).select("+password");

    if (!user) {
        throw createError(
            404,
            "User not found"
        );
    }

    if (
        user.authProvider === "GOOGLE" &&
        !user.password
    ) {
        throw createError(
            400,
            "This account uses Google login. Please continue with Google."
        );
    }

    const isPasswordValid =
        await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw createError(
            401,
            "Invalid credentials"
        );
    }

    const {
        accessToken,
        refreshToken
    } = await generateRefreshAccessToken(
        user._id
    );

    const loggedInUser = await User.findById(
        user._id
    ).select("-password -refreshToken");

    return res
        .status(200)
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
        .json({
            user: loggedInUser,
            message: "User logged in successfully"
        });
};

const googleOAuthCallback = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            throw createError(
                401,
                "Google authentication failed"
            );
        }

        const {
            accessToken,
            refreshToken
        } = await generateRefreshAccessToken(
            user._id
        );

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
            .redirect(
                `${process.env.FRONTEND_URL}/dashboard`
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

const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }
    );

    return res
        .status(200)
        .clearCookie(
            "accessToken",
            cookieOptions
        )
        .clearCookie(
            "refreshToken",
            cookieOptions
        )
        .json({
            message: "User logged out successfully"
        });
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id)
        .select("-password -refreshToken");

    if (!user) {
        throw createError(
            404,
            "User not found"
        );
    }

    return res
        .status(200)
        .json({
            message: "User fetched successfully",
            user
        });
};

const getCurrentUser = async (req, res) => {
    const user = await User.findById(
        req.user._id
    ).select("-password -refreshToken");

    if (!user) {
        throw createError(
            404,
            "User not found"
        );
    }

    return res
        .status(200)
        .json({
            message: "Current user fetched successfully",
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
    googleOAuthCallback
};