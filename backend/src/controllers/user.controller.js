
import User from "../models/userModel";
import jwt from "jsonwebtoken";

const generateRefreshAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User with id does not exists");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (err) {
        throw new Error("Error generating refresh token");
    }
};

const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new Error(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new Error(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new Error(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        const { accessToken, refreshToken } =
            await generateRefreshAccessToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                accessToken,
                refreshToken,
                message: "Access token refreshed"
            });

    } catch (error) {
        throw new Error(
            401,
            error?.message || "Invalid refresh token"
        );
    }
};


const registerUser = async (req, res) => {
    const { role, email, name, password } = req.body;

    if (
        [name, email, role, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new Error(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ name }, { email }]
    });

    if (existedUser) {
        throw new Error(
            409,
            "User with this name or email already exists"
        );
    }

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    const { accessToken, refreshToken } =
        await generateRefreshAccessToken(user._id);

    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken");

    if (!createdUser) {
        throw new Error(
            500,
            "Error while registering the user"
        );
    }

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "User registered successfully",
            user: createdUser
        });
};

const loginUser = async (req, res) => {
    const { name, email, password } = req.body || {};

    if ((!name && !email) || !password) {
        throw new Error(
            400,
            "name/Email and password are required"
        );
    }

    const user = await User.findOne({
        $or: [{ name }, { email }]
    });

    if (!user) {
        throw new Error(404, "User not found");
    }

    const isPasswordValid =
        await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new Error(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } =
        await generateRefreshAccessToken(user._id);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            user: loggedInUser,
            message: "User logged in successfully"
        });
};

const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            message: "User logged out"
        });
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id)
        .select("-password -refreshToken");

    if (!user) {
        throw new Error(404, "User not found");
    }

    return res
        .status(200)
        .json({
            message: "User fetched successfully",
            user
        });
};

const getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user._id)
        .select("-password -refreshToken");

    if (!user) {
        throw new Error(404, "User not found");
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
};

