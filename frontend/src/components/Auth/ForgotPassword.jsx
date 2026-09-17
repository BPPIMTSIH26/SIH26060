import { useState } from "react";
import { Mail, KeyRound, Lock, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { authAPI } from "../../services/config";
import { useToast } from "../../components/context/ToastContext";

export default function ForgotPassword({ onBackToLogin }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const showToast = useToast();

    // Trigger OTP Generation (Prints to Backend Terminal)
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authAPI.resetPassword(email);
            showToast("OTP generated. Awaiting terminal confirmation.", "info");
            setStep(2); // Move to OTP entry step
        } catch (error) {
            console.error(error);
            showToast(error.message || "Failed to initiate recovery.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Submit the OTP and New Password
    const handleVerifyAndReset = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 8) {
            showToast("Security protocol requires at least 8 characters.", "error");
            return;
        }

        setLoading(true);
        try {
            await authAPI.verifyOtpAndReset({ email, otp, newPassword });
            showToast("Access codes successfully reset.", "success");
            onBackToLogin(); // Send them back to the login screen
        } catch (error) {
            console.error(error);
            showToast(error.message || "Invalid OTP or network error.", "error");
        } finally {
            setLoading(false);
        }
    };

    const inputBase = "w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors text-base sm:text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400";

    return (
        <div className="w-full max-w-sm px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {step === 1 ? "Signal Lost?" : "Verify Clearance"}
                </h1>
                <p className="text-base sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                    {step === 1 
                        ? "Enter your registered email to reset your access codes." 
                        : "Enter the 6-digit terminal override code and your new password."}
                </p>
            </div>

            {/* STEP 1: REQUEST OTP */}
            {step === 1 && (
                <form onSubmit={handleRequestOtp} className="space-y-6 sm:space-y-5 animate-in fade-in duration-300">
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
                                onChange={(e) => setEmail(e.target.value)} 
                                className={inputBase} 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full flex items-center justify-center gap-2 py-3 mt-6 rounded-xl font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 text-base sm:text-sm"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Initiate Recovery <ArrowRight size={18} className="sm:w-4 sm:h-4" /></>}
                    </button>
                </form>
            )}

            {/* STEP 2: VERIFY OTP AND RESET */}
            {step === 2 && (
                <form onSubmit={handleVerifyAndReset} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-base sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 sm:mb-1.5">
                            6-Digit Override Code
                        </label>
                        <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />
                            <input 
                                type="text" 
                                required 
                                maxLength={6}
                                placeholder="123456" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                                className={`${inputBase} tracking-[0.5em] font-mono`} 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-base sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 sm:mb-1.5">
                            New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />
                            <input 
                                type="password" 
                                required 
                                placeholder="••••••••" 
                                minLength={8}
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                className={inputBase} 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 text-base sm:text-sm"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Confirm Reset <Lock size={18} className="sm:w-4 sm:h-4" /></>}
                    </button>
                </form>
            )}

            <p className="mt-8 text-center text-base sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                <button 
                    type="button" 
                    onClick={step === 2 ? () => setStep(1) : onBackToLogin} 
                    className="font-semibold flex items-center justify-center gap-1 mx-auto text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400 transition-colors p-2 -my-2"
                >
                    <ArrowLeft className="w-4 h-4" /> {step === 2 ? "Go Back" : "Abort & Return to Login"}
                </button>
            </p>
        </div>
    );
}