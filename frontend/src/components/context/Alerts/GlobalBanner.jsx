import { useGlobalAlert } from "./GlobalAlertContext";
import { ShieldAlert, TriangleAlert, Info, X, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function GlobalBanner() {
    const { bannerAlert, dismissBanner } = useGlobalAlert();

    if (!bannerAlert) return null;

    const formatSystemName = (sys) => {
        if (!sys) return "";
        return sys
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const getFormattedTime = (alert) => {
        let diffMins = alert.minutes_ago;

        if (alert.timestamp) {
            const diffMs = new Date() - new Date(alert.timestamp);
            diffMins = Math.max(0, Math.floor(diffMs / 60000));
        }

        if (diffMins === undefined || diffMins === null || isNaN(diffMins)) {
            return "Just now";
        }

        if (diffMins < 1) {
            return "Just now";
        }
        if (diffMins < 60) {
            return `${diffMins}m ago`;
        }
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) {
            return `${diffHours}h ago`;
        }

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    const getBannerConfig = (severity) => {
        switch(severity) {
            case "CRITICAL": 
                return { 
                    container: "bg-red-950/95 text-red-100 border-b border-red-800 backdrop-blur-md shadow-lg shadow-red-950/50", 
                    iconBadge: "bg-red-900/80 text-red-400 border border-red-700/50",
                    title: "text-red-100 font-sans tracking-normal",
                    subtitle: "text-red-300/90 font-sans",
                    btn: "bg-red-600 hover:bg-red-500 text-white font-sans shadow-md border border-red-500/50",
                    closeBtn: "text-red-400 hover:bg-red-900/50",
                    icon: ShieldAlert, 
                    pulse: true 
                };
            case "WARNING": 
                return { 
                    container: "bg-amber-950/95 text-amber-100 border-b border-amber-800 backdrop-blur-md shadow-lg shadow-amber-950/50", 
                    iconBadge: "bg-amber-900/80 text-amber-400 border border-amber-700/50",
                    title: "text-amber-100 font-sans tracking-normal",
                    subtitle: "text-amber-300/90 font-sans",
                    btn: "bg-amber-600 hover:bg-amber-500 text-white font-sans shadow-md border border-amber-500/50",
                    closeBtn: "text-amber-400 hover:bg-amber-900/50",
                    icon: TriangleAlert, 
                    pulse: false 
                };
            default: 
                return { 
                    container: "bg-slate-900/95 text-slate-100 border-b border-slate-800 backdrop-blur-md shadow-lg", 
                    iconBadge: "bg-slate-800 text-cyan-400 border border-slate-700",
                    title: "text-slate-100 font-sans tracking-normal",
                    subtitle: "text-slate-300/90 font-sans",
                    btn: "bg-cyan-600 hover:bg-cyan-500 text-white font-sans shadow-md border border-cyan-500/50",
                    closeBtn: "text-slate-400 hover:bg-slate-800",
                    icon: Info, 
                    pulse: false 
                };
        }
    };

    const config = getBannerConfig(bannerAlert.severity);
    const Icon = config.icon;
    const formattedSystems = bannerAlert.affected_systems?.map(formatSystemName).join(", ");

    return (
        <div className={`w-full transition-all duration-300 ease-out ${config.container}`}>
            {/* Optimized padding and structure to fit mobile screens gracefully */}
            <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-start sm:items-center justify-between gap-3">
                
                {/* Left Side: Icon & Content */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl mt-0.5 sm:mt-0 ${config.iconBadge}`}>
                        {config.pulse && <span className="absolute inset-0 animate-ping rounded-xl bg-current opacity-20" />}
                        <Icon className="h-5 w-5 relative z-10" strokeWidth={2} />
                    </div>

                    <div className="flex flex-col justify-center min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                            <span className="font-mono uppercase text-[0.65rem] sm:text-xs font-bold px-2 py-0.5 rounded bg-black/40 tracking-wider shrink-0">
                                {bannerAlert.severity}
                            </span>
                            <h4 className={`text-xs sm:text-base font-bold leading-snug break-words ${config.title}`}>
                                {bannerAlert.message}
                            </h4>
                        </div>
                        
                        <p className={`text-[0.7rem] sm:text-xs font-normal flex flex-wrap items-center gap-x-2 gap-y-0.5 ${config.subtitle}`}>
                            {formattedSystems && (
                                <>
                                    <span className="truncate max-w-[200px] sm:max-w-none">
                                        <strong className="font-medium opacity-80">Systems:</strong> {formattedSystems}
                                    </span>
                                    <span className="opacity-40 hidden sm:inline">•</span>
                                </>
                            )}
                            <span className="font-mono text-[0.65rem] opacity-75">{getFormattedTime(bannerAlert)}</span>
                        </p>
                    </div>
                </div>

                {/* Right Side: Actions (Stacked nicely or inline depending on space) */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                    {bannerAlert.actionLink && (
                        <Link 
                            to={bannerAlert.actionLink}
                            onClick={dismissBanner}
                            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 sm:px-4 py-1 text-[0.7rem] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-95 ${config.btn}`}
                        >
                            <span>Action</span> <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
                        </Link>
                    )}
                    <button 
                        onClick={dismissBanner} 
                        className={`p-1.5 rounded-full transition-colors duration-200 ${config.closeBtn}`}
                        aria-label="Dismiss Alert"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                    </button>
                </div>
                
            </div>
        </div>
    );
}