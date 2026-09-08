import { useState } from "react";
import {
    User,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { authAPI } from "../../services/api/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/context/ToastContext";

export default function Login({
    onSwitchMode,
    onForgotClick,
}) {
    const navigate = useNavigate();
    const showToast = useToast();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        const trimmedIdentifier = identifier.trim();

        if (!trimmedIdentifier) {
            showToast(
                "Username or email is required.",
                "error"
            );
            return;
        }

        if (!password) {
            showToast(
                "Password is required.",
                "error"
            );
            return;
        }

        if (password.length < 6) {
            showToast(
                "Password must contain at least 6 characters.",
                "error"
            );
            return;
        }

        setLoading(true);

        try {
            const result = await authAPI.login({
                email: trimmedIdentifier.includes("@")
                    ? trimmedIdentifier
                    : undefined,
                name: !trimmedIdentifier.includes("@")
                    ? trimmedIdentifier
                    : undefined,
                password,
            });

            /*
             * Backend flow:
             *
             * POST /users/login
             *
             * Response:
             * {
             *   message: "...",
             *   requiresOtp: true
             * }
             *
             * The backend also sets the HTTP-only
             * otpVerificationToken cookie.
             *
             * Therefore we do NOT create the
             * authenticated localStorage session here.
             */
            if (result?.requiresOtp) {
                showToast(
                    "Credentials verified. OTP sent to your registered email.",
                    "success"
                );

                navigate(
                    "/verify-otp",
                    {
                        replace: true,
                    }
                );

                return;
            }

            /*
             * Defensive fallback in case the backend
             * ever changes and does not require OTP.
             */
            showToast(
                result?.message ||
                    "Login successful.",
                "success"
            );

            navigate(
                "/dashboard",
                {
                    replace: true,
                }
            );
        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            showToast(
                error?.message ||
                    "Authentication failed. Please check your credentials.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const inputBase =
        "w-full pl-11 pr-11 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors text-base sm:text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400";

    return (
        <div className="w-full max-w-sm px-4 sm:px-0">
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    System Login
                </h1>

                <p className="text-base sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                    Enter your credentials to access the Polar Twin network.
                </p>
            </div>

            <form
                className="space-y-6 sm:space-y-5"
                onSubmit={handleLogin}
            >
                {/* USERNAME / EMAIL */}
                <div>
                    <label className="block text-base sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 sm:mb-1.5">
                        Username or Email
                    </label>

                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />

                        <input
                            type="text"
                            required
                            placeholder="operator@ncpor.gov"
                            value={identifier}
                            onChange={(e) =>
                                setIdentifier(
                                    e.target.value
                                )
                            }
                            className={inputBase}
                            autoComplete="username"
                        />
                    </div>
                </div>

                {/* PASSWORD */}
                <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-1.5">
                        <label className="block text-base sm:text-sm font-semibold text-gray-700 dark:text-slate-300">
                            Password
                        </label>

                        <button
                            type="button"
                            onClick={onForgotClick}
                            disabled={loading}
                            className="text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400 transition-colors p-1 -mr-1 disabled:opacity-50"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            required
                            minLength={6}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            className={inputBase}
                            autoComplete="current-password"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (prev) => !prev
                                )
                            }
                            disabled={loading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 disabled:opacity-50"
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff
                                    size={20}
                                    className="sm:w-4 sm:h-4"
                                />
                            ) : (
                                <Eye
                                    size={20}
                                    className="sm:w-4 sm:h-4"
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 mt-6 rounded-xl font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 text-base sm:text-sm"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5" />
                            Verifying...
                        </>
                    ) : (
                        <>
                            Verify Credentials
                            <ArrowRight
                                size={18}
                                className="sm:w-4 sm:h-4"
                            />
                        </>
                    )}
                </button>
            </form>

            {/* REGISTER */}
            <p className="mt-8 text-center text-base sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                No clearance?{" "}

                <button
                    type="button"
                    onClick={onSwitchMode}
                    disabled={loading}
                    className="font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400 transition-colors p-2 -my-2 disabled:opacity-50"
                >
                    Request Access
                </button>
            </p>
        </div>
    );
}