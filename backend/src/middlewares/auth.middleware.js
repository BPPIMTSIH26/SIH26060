import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const verifyJwt = async (
    req,
    res,
    next
) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req
                .header("Authorization")
                ?.replace(
                    /^Bearer\s+/i,
                    ""
                );

        if (!token) {
            return res.status(401).json({
                message:
                    "No access token found"
            });
        }

        const decodedToken =
            jwt.verify(
                token,
                process.env
                    .ACCESS_TOKEN_SECRET
            );

        const user =
            await User.findById(
                decodedToken._id
            ).select(
                "-password -refreshToken"
            );

        if (!user) {
            return res.status(401).json({
                message:
                    "Unauthorized"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message:
                    "User account is inactive"
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            message:
                "Invalid or expired access token"
        });
    }
};

export const authorizeRoles = (
    ...allowedRoles
) => {
    return (
        req,
        res,
        next
    ) => {
        if (!req.user) {
            return res.status(401).json({
                message:
                    "Unauthorized"
            });
        }

        if (
            !allowedRoles.includes(
                req.user.role
            )
        ) {
            return res.status(403).json({
                message:
                    "You do not have permission to perform this action"
            });
        }

        next();
    };
};