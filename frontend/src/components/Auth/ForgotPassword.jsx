import { useState } from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { authAPI } from "../../services/config";
import { useToast } from "../../components/context/ToastContext"; // Import the custom hook

export default function ForgotPassword({ onBackToLogin }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // Initialize the toast function
    const showToast = useToast();

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Using the centralized API client
            await authAPI.resetPassword(email);
            
            // Trigger the success toast notification
            showToast("Recovery instructions sent to network relay.", "info");
            
            onBackToLogin();
        } catch (error) {
            console.error(error);
            // Replace the ugly browser alert with our themed error toast
            showToast(error.message || "Failed to initiate recovery. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Mobile optimized input: text-base prevents iOS zoom on focus, py-3 creates a larger touch target
    const inputBase = "w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors text-base sm:text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400";

    return (
        <div className="w-full max-w-sm px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Signal Lost?
                </h1>
                <p className="text-base sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                    Enter your registered email to reset your access codes.
                </p>
            </div>

            <form onSubmit={handleReset} className="space-y-6 sm:space-y-5">
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

            <p className="mt-8 text-center text-base sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                <button 
                    type="button" 
                    onClick={onBackToLogin} 
                    className="font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400 transition-colors p-2 -my-2"
                >
                    Abort & Return to Login
                </button>
            </p>
            
        </div>
    );
}