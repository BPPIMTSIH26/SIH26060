import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { authAPI } from "../../services/config";
import { useToast } from "../../components/context/ToastContext"; // Import the custom hook

export default function Login({ onSwitchMode, onForgotClick }) {
    const navigate = useNavigate();
    const showToast = useToast(); // Initialize the toast function

    const [identifier, setIdentifier] = useState(""); 
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Using the centralized API client
            const data = await authAPI.login({
                email: identifier.includes('@') ? identifier : undefined,
                username: !identifier.includes('@') ? identifier : undefined,
                password
            });

            // Save user session for ProtectedRoute and Header
            localStorage.setItem("polar_twin_user", JSON.stringify({
                fullName: data.data.user.fullName,
                email: data.data.user.email,
                role: data.data.user.role || "station_master",
                avatar: data.data.user.avatar
            }));

            // Trigger the success toast notification (Personalized)
            showToast(`Clearance verified. Welcome back, ${data.data.user.fullName}.`, "success");

            // Navigate to dashboard
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error(error);
            // Replace ugly browser alert with our themed error toast
            showToast(error.message || "Authentication failed. Please check your credentials.", "error"); 
        } finally {
            setLoading(false);
        }
    };

    // Mobile optimization: text-base prevents iOS zoom on focus, py-3 creates a larger touch target
    const inputBase = "w-full pl-11 pr-11 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors text-base sm:text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400";

    return (
        <div className="w-full max-w-sm px-4 sm:px-0">
            
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    System Login
                </h1>
                <p className="text-base sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                    Enter your credentials to access the dashboard.
                </p>
            </div>

            <form className="space-y-6 sm:space-y-5" onSubmit={handleLogin}>
                
                {/* Username / Email Field */}
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
                            onChange={(e) => setIdentifier(e.target.value)} 
                            className={inputBase} 
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-1.5">
                        <label className="block text-base sm:text-sm font-semibold text-gray-700 dark:text-slate-300">
                            Password
                        </label>
                        <button 
                            type="button" 
                            onClick={onForgotClick} 
                            className="text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400 transition-colors p-1 -mr-1"
                        >
                            Forgot password?
                        </button>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-gray-400" />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            required 
                            placeholder="••••••••" 
                            minLength={8}
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className={inputBase} 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={20} className="sm:w-4 sm:h-4" /> : <Eye size={20} className="sm:w-4 sm:h-4" />}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full flex items-center justify-center gap-2 py-3 mt-6 rounded-xl font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 text-base sm:text-sm"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Sign In <ArrowRight size={18} className="sm:w-4 sm:h-4" /></>}
                </button>
            </form>

            {/* Switch Mode */}
            <p className="mt-8 text-center text-base sm:text-sm font-medium text-gray-600 dark:text-slate-400">
                No clearance?{" "}
                <button 
                    type="button" 
                    onClick={onSwitchMode} 
                    className="font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400 transition-colors p-2 -my-2"
                >
                    Request Access
                </button>
            </p>
            
        </div>
    );
}