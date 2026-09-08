
import { useState } from "react";
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Loader2,
    Building,
    Package,
    Shield,
    MapPin,
    Eye,
    EyeOff,
} from "lucide-react";
import { authAPI } from "../../services/api/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/context/ToastContext";

const ROLE_OPTIONS = [
    {
        value: "NCPOR Operator",
        label: "NCPOR Operator",
        icon: Shield,
    },
    {
        value: "Station Manager",
        label: "Station Manager",
        icon: Building,
    },
    {
        value: "Logistics Manager",
        label: "Logistics Manager",
        icon: Package,
    },
];

export default function Signup({
    onSwitchMode,
}) {
    const navigate = useNavigate();
    const showToast = useToast();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Station Manager",
        station: "Maitri",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoleChange = (role) => {
        setFormData((prev) => ({
            ...prev,
            role,
            station:
                role === "Station Manager" ||
                role === "Logistics Manager"
                    ? prev.station || "Maitri"
                    : "",
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (formData.name.trim().length < 2) {
            showToast(
                "Name must contain at least 2 characters.",
                "error"
            );
            return;
        }

        if (formData.password.length < 6) {
            showToast(
                "Password must contain at least 6 characters.",
                "error"
            );
            return;
        }

        if (
            formData.role !== "NCPOR Operator" &&
            !formData.station
        ) {
            showToast(
                "Select a station.",
                "error"
            );
            return;
        }

        setLoading(true);

        try {
            const result = await authAPI.register(formData);

            /*
             * Backend registration flow:
             *
             * POST /users/register
             *
             * Backend creates the user and sends an OTP.
             *
             * Response:
             * {
             *   message,
             *   requiresOtp: true,
             *   userId
             * }
             *
             * Authentication is NOT complete yet.
             */
            if (result?.requiresOtp) {
                showToast(
                    "Registration successful. OTP sent to your registered email.",
                    "success"
                );

                navigate("/verify-otp", {
                    replace: true,
                });

                return;
            }

            showToast(
                result?.message ||
                    "Account created successfully.",
                "success"
            );
        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            showToast(
                error?.message ||
                    "Failed to register account.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const inputBase =
        "w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-colors text-base sm:text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400";

    return (
        <div className="w-full max-w-sm px-4 sm:px-0">
            <div className="mb-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">
                    Request Clearance
                </h1>

                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Register for Polar Twin network access.
                </p>
            </div>

            <form
                onSubmit={handleSignup}
                className="space-y-4"
            >
                {/* OPERATIONAL ROLE */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                        Operational Role
                    </label>

                    <div className="space-y-2">
                        {ROLE_OPTIONS.map((option) => {
                            const Icon = option.icon;

                            const active =
                                formData.role === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                        handleRoleChange(
                                            option.value
                                        )
                                    }
                                    disabled={loading}
                                    className={`w-full flex items-center p-3 rounded-xl border transition-all ${
                                        active
                                            ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400"
                                            : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                                    } disabled:opacity-60`}
                                >
                                    <div
                                        className={`flex items-center justify-center w-9 h-9 rounded-lg mr-3 ${
                                            active
                                                ? "bg-cyan-100 dark:bg-cyan-900/40"
                                                : "bg-gray-100 dark:bg-slate-800"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </div>

                                    <span className="text-sm font-semibold">
                                        {option.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* FULL NAME */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                        Full Name
                    </label>

                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                        <input
                            type="text"
                            name="name"
                            required
                            minLength={2}
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className={inputBase}
                            autoComplete="name"
                        />
                    </div>
                </div>

                {/* EMAIL */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                        Email Address
                    </label>

                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="official@ncpor.gov"
                            className={inputBase}
                            autoComplete="email"
                        />
                    </div>
                </div>

                {/* PASSWORD */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                        Password
                    </label>

                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={inputBase}
                            autoComplete="new-password"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (prev) => !prev
                                )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 p-2"
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                </div>

                {/* STATION */}
                {formData.role !== "NCPOR Operator" && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                            Assigned Station
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                            {["Maitri", "Bharati"].map(
                                (station) => (
                                    <button
                                        key={station}
                                        type="button"
                                        disabled={loading}
                                        onClick={() =>
                                            setFormData(
                                                (prev) => ({
                                                    ...prev,
                                                    station,
                                                })
                                            )
                                        }
                                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all ${
                                            formData.station ===
                                            station
                                                ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400"
                                                : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                                        } disabled:opacity-60`}
                                    >
                                        <MapPin className="w-4 h-4" />
                                        {station}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm transition-all disabled:opacity-70"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5" />
                            Registering...
                        </>
                    ) : (
                        <>
                            Register Account
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>

            {/* LOGIN */}
            <p className="mt-6 text-center text-sm font-medium text-gray-600 dark:text-slate-400">
                Already registered?{" "}

                <button
                    type="button"
                    onClick={onSwitchMode}
                    disabled={loading}
                    className="font-semibold text-cyan-600 dark:text-cyan-500 disabled:opacity-50"
                >
                    Login
                </button>
            </p>
        </div>
    );
}

