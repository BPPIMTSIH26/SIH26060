import { useState } from "react";
import {
    Mail,
    ArrowRight,
    Loader2,
    Lock,
    KeyRound,
} from "lucide-react";
import { authAPI } from "../../services/api/auth";
import { useToast } from "../../components/context/ToastContext";

export default function ForgotPassword({
    onBackToLogin,
}) {
    const [step, setStep] = useState("email");

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] = useState(false);

    const showToast = useToast();

    const handleSendOtp = async (e) => {
        e.preventDefault();

        const normalizedEmail =
            email.trim().toLowerCase();

        if (!normalizedEmail) {
            showToast(
                "Email address is required.",
                "error"
            );
            return;
        }

        setLoading(true);

        try {
            await authAPI.forgotPassword(
                normalizedEmail
            );

            showToast(
                "Recovery OTP sent to your registered email.",
                "success"
            );

            setStep("reset");
        } catch (error) {
            console.error(
                "Password recovery request error:",
                error
            );

            showToast(
                error?.message ||
                    "Failed to initiate password recovery. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!otp.trim()) {
            showToast(
                "Verification OTP is required.",
                "error"
            );
            return;
        }

        if (newPassword.length < 6) {
            showToast(
                "Password must contain at least 6 characters.",
                "error"
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast(
                "New passwords do not match.",
                "error"
            );
            return;
        }

        setLoading(true);

        try {
            await authAPI.resetPassword({
                otp: otp.trim(),
                newPassword,
            });

            showToast(
                "Password reset successfully. Please login again.",
                "success"
            );

            setEmail("");
            setOtp("");
            setNewPassword("");
            setConfirmPassword("");

            onBackToLogin?.();
        } catch (error) {
            console.error(
                "Password reset error:",
                error
            );

            showToast(
                error?.message ||
                    "Failed to reset password. Please verify the OTP and try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBackToEmail = () => {
        setStep("email");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const inputBase =
        "w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors text-base sm:text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400";

    return (
        <div className="w-full max-w-sm px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-300">

            {/* =========================================================
                STEP 1 - ENTER EMAIL
               ========================================================= */}

            {step === "email" && (
                <>
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-3xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Signal Lost?
                        </h1>

                        <p className="text-base sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                            Enter your registered email to receive a
                            password recovery OTP.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSendOtp}
                        className="space-y-6 sm:space-y-5"
                    >
                        <div>
                            <label className="block text-base sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 sm:mb-1.5">
                                Email Address
                            </label>

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />

                                <input
                                    type="email"
                                    required
                                    placeholder="operator@ncpor.gov"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    className={inputBase}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 mt-6 rounded-xl font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 text-base sm:text-sm"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    Sending OTP...
                                </>
                            ) : (
                                <>
                                    Send Recovery OTP
                                    <ArrowRight
                                        size={18}
                                        className="sm:w-4 sm:h-4"
                                    />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-base sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                        <button
                            type="button"
                            onClick={onBackToLogin}
                            className="font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400 transition-colors p-2 -my-2"
                        >
                            Abort & Return to Login
                        </button>
                    </p>
                </>
            )}

            {/* =========================================================
                STEP 2 - OTP + NEW PASSWORD
               ========================================================= */}

            {step === "reset" && (
                <>
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-3xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Restore Access
                        </h1>

                        <p className="text-base sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                            Enter the OTP sent to{" "}
                            <span className="font-semibold text-cyan-600 dark:text-cyan-400 break-all">
                                {email}
                            </span>{" "}
                            and create a new password.
                        </p>
                    </div>

                    <form
                        onSubmit={handleResetPassword}
                        className="space-y-5"
                    >
                        {/* OTP */}
                        <div>
                            <label className="block text-base sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                Verification OTP
                            </label>

                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    required
                                    maxLength={6}
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                    }
                                    className={`${inputBase} tracking-[0.3em] font-mono`}
                                    autoComplete="one-time-code"
                                />
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-base sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                New Password
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />

                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }
                                    className={inputBase}
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-base sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                Confirm New Password
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />

                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    className={inputBase}
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 mt-6 rounded-xl font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 text-base sm:text-sm"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    Resetting...
                                </>
                            ) : (
                                <>
                                    Reset Password
                                    <ArrowRight
                                        size={18}
                                        className="sm:w-4 sm:h-4"
                                    />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col items-center gap-2 text-center">
                        <button
                            type="button"
                            onClick={handleBackToEmail}
                            disabled={loading}
                            className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                        >
                            Use a different email
                        </button>

                        <button
                            type="button"
                            onClick={onBackToLogin}
                            disabled={loading}
                            className="text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Abort & Return to Login
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}