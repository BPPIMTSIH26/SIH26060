import { useState } from "react";
import { Mail, Lock, User, Fingerprint, ArrowRight, Loader2, Building, Package, Shield, Upload, Eye, EyeOff, MapPin, KeyRound, ArrowLeft } from "lucide-react";
import { authAPI } from "../../services/config";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/context/ToastContext";

export default function Signup({ onSwitchMode }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState("");

    const showToast = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        role: "station_master",
        station: "Maitri" 
    });
    const [avatar, setAvatar] = useState(null); 

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handles moving from Step 2 -> Step 3 (Triggers OTP Email)
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        
        if (formData.password.length < 8) {
            showToast("Security protocol requires at least 8 characters.", "error");
            return;
        }

        setLoading(true);
        try {
            await authAPI.sendRegistrationOtp({ email: formData.email, username: formData.username });
            showToast("Clearance code dispatched. Check your inbox.", "info");
            setStep(3); // Move to OTP input step
        } catch (error) {
            console.error(error);
            showToast(error.message || "Failed to initiate registration.", "error");
        } finally {
            setLoading(false);
        }
    };

// Handles the Final Submission (Step 3 -> Dashboard)
    const handleFinalSignup = async (e) => {
        e.preventDefault();
        
        const payload = new FormData();
        payload.append("fullName", formData.fullName);
        payload.append("username", formData.username);
        payload.append("email", formData.email);
        payload.append("password", formData.password);
        payload.append("role", formData.role); 
        payload.append("otp", otp);
        
        if (formData.role === "station_master") {
            payload.append("station", formData.station);
        }

        if (avatar) payload.append("avatar", avatar);

        setLoading(true);
        try {
            // Capture the response from your backend registration route
            const res = await authAPI.register(payload);
            const userObj = res.data?.user || {};

            localStorage.setItem("polar_twin_user", JSON.stringify({
                fullName: userObj.fullName || formData.fullName,
                username: userObj.username || formData.username,
                email: userObj.email || formData.email,
                role: userObj.role || formData.role,
                station: userObj.station || (formData.role === "station_master" ? formData.station : null),
                avatar: userObj.avatar || "",
                createdAt: userObj.createdAt || new Date().toISOString()
            }));

            showToast("Clearance granted. Welcome to Polar Twin.", "success");
            navigate("/dashboard", { replace: true });
            
        } catch (error) {
            console.error(error);
            showToast(error.message || "Invalid clearance code. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const inputBase = "w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors text-base sm:text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400";

    return (
        <div className="w-full max-w-sm px-4 sm:px-0">
            
            <div className="mb-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">
                    {step === 3 ? "Verify Identity" : "Request Clearance"}
                </h1>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    {step === 3 
                        ? `Enter the 6-digit code sent to ${formData.email}` 
                        : "Register for Polar Twin network access."}
                </p>
            </div>

            {/* STEP 1: ROLE SELECTION */}
            {step === 1 && (
                <form onSubmit={() => setStep(2)} className="space-y-4 animate-in fade-in duration-300">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2.5 text-center sm:text-left">
                        Select Operational Role
                    </label>
                    <div className="flex flex-col gap-2.5 mb-6">
                        {/* Station Master */}
                        <label className={`cursor-pointer flex items-center p-3 rounded-xl border transition-all duration-200 ${formData.role === 'station_master' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 shadow-sm' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
                            <input type="radio" name="role" value="station_master" className="hidden" onChange={handleChange} />
                            <div className={`flex items-center justify-center w-9 h-9 rounded-lg mr-3 ${formData.role === 'station_master' ? 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                                <Building className="w-4 h-4" strokeWidth={2} />
                            </div>
                            <div className="flex-1"><span className="block text-sm font-semibold">Station Master</span></div>
                        </label>
                        
                        {/* Logistics Officer */}
                        <label className={`cursor-pointer flex items-center p-3 rounded-xl border transition-all duration-200 ${formData.role === 'logistics' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 shadow-sm' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
                            <input type="radio" name="role" value="logistics" className="hidden" onChange={handleChange} />
                            <div className={`flex items-center justify-center w-9 h-9 rounded-lg mr-3 ${formData.role === 'logistics' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                                <Package className="w-4 h-4" strokeWidth={2} />
                            </div>
                            <div className="flex-1"><span className="block text-sm font-semibold">Logistics Officer</span></div>
                        </label>
                        
                        {/* High Authority */}
                        <label className={`cursor-pointer flex items-center p-3 rounded-xl border transition-all duration-200 ${formData.role === 'authority' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 shadow-sm' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
                            <input type="radio" name="role" value="authority" className="hidden" onChange={handleChange} />
                            <div className={`flex items-center justify-center w-9 h-9 rounded-lg mr-3 ${formData.role === 'authority' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                                <Shield className="w-4 h-4" strokeWidth={2} />
                            </div>
                            <div className="flex-1"><span className="block text-sm font-semibold">High Authority</span></div>
                        </label>
                    </div>

                    <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-cyan-600 hover:bg-cyan-700 text-white text-sm transition-all shadow-sm active:scale-[0.98]">
                        Continue Setup <ArrowRight size={16} />
                    </button>
                </form>
            )}

            {/* STEP 2: PROFILE DETAILS (Now triggers OTP request instead of final signup) */}
            {step === 2 && (
                <form onSubmit={handleRequestOtp} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" name="fullName" required placeholder="John Doe" value={formData.fullName} onChange={handleChange} className={inputBase} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Username</label>
                            <div className="relative">
                                <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" name="username" required placeholder="johndoe" minLength={5} value={formData.username} onChange={handleChange} className={inputBase} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="email" name="email" required placeholder="official@ncpor.gov" value={formData.email} onChange={handleChange} className={inputBase} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Secure Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type={showPassword ? "text" : "password"} name="password" minLength={8} required placeholder="••••••••" value={formData.password} onChange={handleChange} className={inputBase} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2">
                                {showPassword ? <EyeOff size={18} className="sm:w-4 sm:h-4" /> : <Eye size={18} className="sm:w-4 sm:h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className={`grid grid-cols-1 ${formData.role === "station_master" ? "sm:grid-cols-2" : ""} gap-3 sm:gap-4`}>
                        {formData.role === "station_master" && (
                            <div className="animate-in fade-in zoom-in-95 duration-300">
                                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Assigned Station</label>
                                <div className="flex gap-2 sm:gap-3 h-[40px] sm:h-[42px]">
                                    <label className={`flex-1 cursor-pointer flex items-center justify-center rounded-xl border transition-all duration-200 ${formData.station === 'Maitri' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'}`}>
                                        <input type="radio" name="station" value="Maitri" className="hidden" onChange={handleChange} />
                                        <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                                        <span className="text-sm font-semibold tracking-wide">Maitri</span>
                                    </label>
                                    <label className={`flex-1 cursor-pointer flex items-center justify-center rounded-xl border transition-all duration-200 ${formData.station === 'Bharati' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'}`}>
                                        <input type="radio" name="station" value="Bharati" className="hidden" onChange={handleChange} />
                                        <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                                        <span className="text-sm font-semibold tracking-wide">Bharati</span>
                                    </label>
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">ID Badge (Avatar)</label>
                            <label className="flex items-center justify-center w-full h-[40px] sm:h-[42px] border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                    <Upload className="w-4 h-4" />
                                    {avatar ? <span className="truncate max-w-[120px]">{avatar.name}</span> : "Upload Image"}
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} />
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl font-semibold bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-white text-sm hover:opacity-90 active:scale-[0.98] transition-all">
                            Back
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 text-sm">
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <>Request OTP <ArrowRight size={16} /></>}
                        </button>
                    </div>
                </form>
            )}

            {/* STEP 3: OTP VERIFICATION */}
            {step === 3 && (
                <form onSubmit={handleFinalSignup} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                            6-Digit Clearance Code
                        </label>
                        <div className="relative">
                            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                required 
                                maxLength={6}
                                placeholder="123456" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                                className={`${inputBase} tracking-[0.5em] font-mono`} 
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setStep(2)} className="px-5 py-2.5 rounded-xl font-semibold bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-white text-sm hover:opacity-90 active:scale-[0.98] transition-all">
                            Back
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm active:scale-[0.98] transition-all disabled:opacity-70 text-sm">
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <>Verify & Register <Shield size={16} /></>}
                        </button>
                    </div>
                </form>
            )}

            <p className="mt-6 text-center text-sm font-medium text-gray-600 dark:text-slate-400">
                Already hold clearance?{" "}
                <button type="button" onClick={onSwitchMode} className="font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 dark:hover:text-cyan-400 transition-colors p-2 -my-2">
                    Login
                </button>
            </p>
            
        </div>
    );
}