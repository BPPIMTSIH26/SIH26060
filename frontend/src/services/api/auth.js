import { BASE_URL } from "../api/config.js";

const handleResponse = async (
    response,
    defaultMessage
) => {
    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    console.log("API RESPONSE:", {
        url: response.url,
        status: response.status,
        statusText: response.statusText,
        data,
    });

    if (!response.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            `${defaultMessage} (${response.status})`
        );
    }

    return data;
};

export const authAPI = {

    // =========================================================
    // LOGIN
    // =========================================================

    login: async ({
        email,
        name,
        password,
    }) => {
        const payload = {
            password,
        };

        if (email?.trim()) {
            payload.email = email
                .trim()
                .toLowerCase();
        } else if (name?.trim()) {
            payload.name = name.trim();
        } else {
            throw new Error(
                "Email or name is required."
            );
        }

        const response = await fetch(
            `${BASE_URL}/users/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            }
        );

        return handleResponse(
            response,
            "Login failed"
        );
    },

    // =========================================================
    // REGISTER
    // =========================================================

    register: async ({
        name,
        email,
        password,
        role,
        station,
    }) => {
        const payload = {
            name: name?.trim(),
            email: email
                ?.trim()
                .toLowerCase(),
            password,
            role,
        };

        if (
            role !== "NCPOR Operator" &&
            station
        ) {
            payload.station = station
                .trim()
                .toUpperCase();
        }

        const response = await fetch(
            `${BASE_URL}/users/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            }
        );

        return handleResponse(
            response,
            "Registration failed"
        );
    },

    // =========================================================
    // VERIFY OTP
    // =========================================================

    verifyOtp: async (otp) => {
        const response = await fetch(
            `${BASE_URL}/users/verify-otp`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    otp: otp.trim(),
                }),
            }
        );

        return handleResponse(
            response,
            "OTP verification failed"
        );
    },

    // =========================================================
    // RESEND OTP
    // =========================================================

    resendOtp: async () => {
        const response = await fetch(
            `${BASE_URL}/users/resend-otp`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        return handleResponse(
            response,
            "Failed to resend OTP"
        );
    },

    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    forgotPassword: async (email) => {
        const normalizedEmail = email
            ?.trim()
            .toLowerCase();

        if (!normalizedEmail) {
            throw new Error(
                "Email address is required."
            );
        }

        const response = await fetch(
            `${BASE_URL}/users/forgot-password`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: normalizedEmail,
                }),
            }
        );

        return handleResponse(
            response,
            "Failed to initiate password recovery"
        );
    },

    // =========================================================
    // RESET PASSWORD
    // =========================================================

    resetPassword: async ({
        otp,
        newPassword,
    }) => {
        if (!otp?.trim()) {
            throw new Error(
                "OTP is required."
            );
        }

        if (!newPassword) {
            throw new Error(
                "New password is required."
            );
        }

        const response = await fetch(
            `${BASE_URL}/users/reset-password`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    otp: otp.trim(),
                    newPassword,
                }),
            }
        );

        return handleResponse(
            response,
            "Failed to reset password"
        );
    },

    // =========================================================
    // UPDATE PASSWORD
    // =========================================================

    updatePassword: async ({
        currentPassword,
        newPassword,
    }) => {
        if (!currentPassword) {
            throw new Error(
                "Current password is required."
            );
        }

        if (!newPassword) {
            throw new Error(
                "New password is required."
            );
        }

        const response = await fetch(
            `${BASE_URL}/users/update-password`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            }
        );

        return handleResponse(
            response,
            "Failed to update password"
        );
    },

    // =========================================================
    // CURRENT USER
    // =========================================================

    getCurrentUser: async () => {
        const response = await fetch(
            `${BASE_URL}/users/current-user`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        return handleResponse(
            response,
            "Failed to fetch current user"
        );
    },

    // =========================================================
    // REFRESH TOKEN
    // =========================================================

    refreshToken: async () => {
        const response = await fetch(
            `${BASE_URL}/users/refresh-token`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        return handleResponse(
            response,
            "Failed to refresh token"
        );
    },

    // =========================================================
    // LOGOUT
    // =========================================================

    logout: async () => {
        const response = await fetch(
            `${BASE_URL}/users/logout`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        return handleResponse(
            response,
            "Logout failed"
        );
    },

    // =========================================================
    // GOOGLE LOGIN
    // =========================================================

    loginWithGoogle: () => {
        window.location.href =
            `${BASE_URL}/users/google`;
    },
};