/* eslint-disable no-unused-vars */
import { Mail, MapPin, Shield, Calendar, User as UserIcon } from "lucide-react";
// Adjust this import path depending on where your reusable components are stored
import AntarcticMap from "../../components/Others/AntarcticMap"; 

export default function Profile() {
    // 1. Retrieve the exact user data saved by your Login/Signup components
    const savedUserData = localStorage.getItem("polar_twin_user");
    const user = savedUserData ? JSON.parse(savedUserData) : null;

    if (!user) {
        return (
            <div className="flex w-full p-6 text-red-500 font-sans font-semibold flex-col items-center animate-in fade-in">
                <h2 className="text-xl font-bold mb-2">Profile Error</h2>
                <p>No active session data found. Please log out and log back in.</p>
            </div>
        );
    }

    // 2. Define Authorization & Display Logic
    const roleLower = (user.role || "").toLowerCase();
    const isMultiStation = roleLower === "logistics" || roleLower === "authority";

    const activeStation = isMultiStation ? "Maitri & Bharati Command" : `${user.station || "Unassigned"} Station`;
    const stationImagePrefix = user.station ? user.station.toLowerCase() : "default";

    // Determine what to pass to the Map Component
    const mapMode = isMultiStation ? "Both" : user.station;

    const getRoleBadge = (role) => {
        if (roleLower.includes("master")) return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/50";
        if (roleLower.includes("logistics")) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50";
        if (roleLower.includes("authority")) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50";
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    };

    const displayRole = (user.role || "Operator").replace("_", " ").replace(/\b\w/g, char => char.toUpperCase());

    const formattedDate = user.createdAt 
        ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
        : "Active Deployment";

    return (
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8 w-full font-sans animate-in fade-in zoom-in-95 duration-300">

            <div className="mb-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Operator Profile
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                    Identity verification and active jurisdiction
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 overflow-hidden transition-colors duration-300">

                {/* DYNAMIC SPLIT BANNER LOGIC */}
                <div className="w-full h-48 md:h-64 relative border-b border-slate-200 dark:border-slate-800 flex bg-slate-900 overflow-hidden">
                    {isMultiStation ? (
                        <>
                            <div className="w-1/2 h-full bg-cover bg-center transition-transform hover:scale-105 duration-700" style={{ backgroundImage: "url('/maitri.jpg')" }} />
                            <div className="w-1 h-full bg-slate-950/80 z-10 absolute left-1/2 -translate-x-1/2 shadow-2xl" />
                            <div className="w-1/2 h-full bg-cover bg-center transition-transform hover:scale-105 duration-700" style={{ backgroundImage: "url('/bharati.jpg')" }} />
                        </>
                    ) : (
                        <div className="w-full h-full bg-cover bg-center transition-transform hover:scale-105 duration-700" style={{ backgroundImage: `url('/${stationImagePrefix}.jpg')` }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent z-10"></div>
                </div>

                <div className="px-6 md:px-10 pb-8 relative">

                    {/* AVATAR OVERLAY */}
                    <div className="absolute -top-16 left-6 md:left-10 w-32 h-32 z-20 rounded-full border-4 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-800 shadow-xl flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                        )}
                    </div>

                    <div className="flex justify-end pt-4 pb-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider border ${getRoleBadge(user.role)}`}>
                            <Shield className="w-3.5 h-3.5 mr-1.5" />
                            {displayRole}
                        </span>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            {user.fullName || "Authorized User"}
                        </h2>
                        <p className="text-sm font-mono font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                            @{user.username || user.email?.split('@')[0] || "operator"}
                        </p>
                    </div>

                    <div className="my-8 border-t border-slate-100 dark:border-slate-800/80"></div>

                    {/* MERGED LAYOUT: TEXT DETAILS + REUSABLE MAP COMPONENT */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
                        
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                                    Communication
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
                                    </div>
                                    <div>
                                        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Secure Email</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.email || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                                    Clearance & Jurisdiction
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Active Jurisdiction</p>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{activeStation}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                                        </div>
                                        <div className="min-w-0">
                                        <p className="text-[0.6rem] font-bold uppercase tracking-wider text-slate-500">Commission Date</p>
                                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                            {formattedDate}
                                        </p>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RENDER THE IMPORTED REUSABLE MAP */}
                        <div className="lg:col-span-1 flex flex-col items-center sm:items-start lg:items-center">
                            <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 w-full text-center lg:text-left">
                                Geographical Deployment
                            </h3>
                            <AntarcticMap activeStation={mapMode} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}