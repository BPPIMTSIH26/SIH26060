import { useState } from "react";
import { Lock, KeyRound, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/config"; // Adjust path if necessary
import { useToast } from "../../components/context/ToastContext";
import ThemeToggle from "../context/ThemeToggle"; 

export default function ResetPassword() {
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [loading, setLoading] = useState(false);

    const showToast = useToast();
    const navigate = useNavigate();

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (passwords.new !== passwords.confirm) {
            showToast("New passwords do not match. Please verify.", "error");
            return;
        }
        if (passwords.new.length < 8) {
            showToast("Security protocol requires at least 8 characters.", "error");
            return;
        }

        setLoading(true);
        try {
            await authAPI.updatePassword({
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            
            showToast("Security credentials successfully updated.", "success");
            navigate("/dashboard"); 
            
        } catch (error) {
            console.error(error);
            showToast(error.message || "Failed to update credentials. Check your current password.", "error");
        } finally {
            setLoading(false);
        }
    };

    const inputBase = "w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors text-base sm:text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400";

    return (
        <div className="relative flex items-center justify-center min-h-screen px-4 py-12 bg-amber-50 dark:bg-slate-950 transition-colors duration-300">
            
            {/* Theme Toggle pinned to top right */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[100]">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Update Credentials
                    </h1>
                    <p className="text-base sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                        Secure your Polar Twin network access.
                    </p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6 sm:space-y-5">
                    
                    {/* CURRENT PASSWORD */}
                    <div>
                        <label className="block text-base sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 sm:mb-1.5">
                            Current Password
                        </label>
                        <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />
                            <input 
                                type="password" 
                                required 
                                placeholder="••••••••" 
                                value={passwords.current} 
                                onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
                                className={inputBase} 
                            />
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-gray-200 dark:bg-slate-800 my-2"></div>

                    {/* NEW PASSWORD */}
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
                                value={passwords.new} 
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                                className={inputBase} 
                            />
                        </div>
                    </div>

                    {/* CONFIRM NEW PASSWORD */}
                    <div>
                        <label className="block text-base sm:text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 sm:mb-1.5">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />
                            <input 
                                type="password" 
                                required 
                                placeholder="••••••••" 
                                value={passwords.confirm} 
                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                                className={inputBase} 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full flex items-center justify-center gap-2 py-3 mt-6 rounded-xl font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 text-base sm:text-sm"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Commit Changes <ShieldCheck size={18} className="sm:w-4 sm:h-4" /></>}
                    </button>
                </form>

                <p className="mt-8 text-center text-base sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                    <button 
                        type="button" 
                        onClick={() => navigate('/dashboard')} 
                        className="font-semibold flex items-center justify-center gap-1 mx-auto text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400 transition-colors p-2 -my-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Abort & Return
                    </button>
                </p>
                
            </div>
        </div>
    );
}