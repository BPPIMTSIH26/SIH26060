import { useState } from "react";
import {
    ShieldCheck,
    Loader2,
    ArrowRight,
    RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { authAPI } from "../../services/api/auth";
import { useToast } from "../context/ToastContext";

export default function VerifyOtp() {
    const navigate = useNavigate();
    const showToast = useToast();

    const [otp, setOtp] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [resending, setResending] =
        useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (otp.trim().length < 4) {
            showToast(
                "Enter the OTP sent to your email.",
                "error"
            );
            return;
        }

        setLoading(true);

        try {
            const result =
                await authAPI.verifyOtp(
                    otp
                );

            const user =
                result?.user;

            if (!user) {
                throw new Error(
                    "Login succeeded but user data was not returned."
                );
            }

            localStorage.setItem(
                "polar_twin_user",
                JSON.stringify({
                    fullName:
                        user.name ||
                        user.fullName ||
                        "Operator",

                    email:
                        user.email || "",

                    role:
                        user.role,

                    station:
                        user.station ||
                        null,

                    avatar:
                        user.avatar ||
                        "",
                })
            );

            showToast(
                `Clearance verified. Welcome, ${
                    user.name ||
                    "Operator"
                }.`,
                "success"
            );

            navigate(
                "/dashboard",
                {
                    replace: true,
                }
            );
        } catch (error) {
            showToast(
                error?.message ||
                    "Invalid or expired OTP.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);

        try {
            await authAPI.resendOtp();

            showToast(
                "A new OTP has been sent.",
                "success"
            );
        } catch (error) {
            showToast(
                error?.message ||
                    "Failed to resend OTP.",
                "error"
            );
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-amber-50 dark:bg-slate-950">

            <div className="w-full max-w-md">

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 sm:p-8">

                    <div className="flex justify-center mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                            <ShieldCheck className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Verify Clearance
                        </h1>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            Enter the OTP sent to your registered email address.
                        </p>
                    </div>

                    <form
                        onSubmit={
                            handleVerify
                        }
                        className="space-y-5"
                    >
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                One-Time Password
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                required
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                                placeholder="123456"
                                className="w-full px-4 py-3 text-center tracking-[0.4em] font-mono text-xl rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-60"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Verify OTP
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={
                            handleResend
                        }
                        disabled={
                            resending
                        }
                        className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${
                                resending
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                        Resend OTP
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/auth"
                            )
                        }
                        className="w-full mt-3 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                    >
                        Return to login
                    </button>
                </div>
            </div>
        </div>
    );
}