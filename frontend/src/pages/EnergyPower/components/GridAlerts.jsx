import { AlertTriangle, ZapOff } from "lucide-react";

export default function GridAlerts({ energyJson }) {
    if (!energyJson || !energyJson.interconnections) {
        return null;
    }

    const alert = energyJson.interconnections;

    const severity = alert.severity || "INFO";
    const criticalAlert = alert.critical_alert || "";
    const alertDescription = alert.alert_description || "";
    const recommendedAction = alert.recommended_action || "";

    const isCritical = severity === "CRITICAL";
    const isWarning = severity === "WARNING";

    const severityColor = isCritical
        ? "text-red-600 dark:text-red-500"
        : isWarning
            ? "text-amber-600 dark:text-amber-500"
            : "text-emerald-600 dark:text-emerald-500";

    const severityBg = isCritical
        ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50"
        : isWarning
            ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50"
            : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50";

    const iconColor = isCritical
        ? "text-red-600 dark:text-red-500"
        : isWarning
            ? "text-amber-600 dark:text-amber-500"
            : "text-emerald-600 dark:text-emerald-500";

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 flex flex-col h-full font-sans">

            {/* Header */}
            <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Grid Interconnections
                </h3>

                <span
                    className={`text-[0.65rem] uppercase tracking-wider font-bold ${severityColor}`}
                >
                    {severity}
                </span>
            </div>

            <div className="flex-1 flex flex-col gap-3">

                {/* No Alert */}
                {!criticalAlert && !alertDescription && (
                    <div className="flex-1 flex items-center justify-center rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/30 p-4">
                        <div className="text-center">
                            <AlertTriangle className="h-5 w-5 text-emerald-500 mx-auto mb-2" />

                            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                Grid Stable
                            </p>

                            <p className="text-[0.65rem] text-emerald-600 dark:text-emerald-500 mt-1">
                                No active interconnection alerts.
                            </p>
                        </div>
                    </div>
                )}

                {/* Active Alert */}
                {(criticalAlert || alertDescription) && (
                    <div
                        className={`flex items-start gap-3 rounded-xl border p-3.5 shadow-sm flex-1 ${severityBg}`}
                    >
                        <ZapOff
                            className={`h-5 w-5 mt-0.5 shrink-0 ${
                                isCritical || isWarning
                                    ? "animate-pulse"
                                    : ""
                            } ${iconColor}`}
                        />

                        <div className="min-w-0">

                            {/* Alert Title */}
                            {criticalAlert && (
                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1 uppercase tracking-wider">
                                    {criticalAlert.replace(/_/g, " ")}
                                </p>
                            )}

                            {/* Alert Description */}
                            {alertDescription && (
                                <p
                                    className={`text-[0.7rem] font-medium leading-relaxed mb-2.5 ${severityColor}`}
                                >
                                    {alertDescription}
                                </p>
                            )}

                            {/* Recommended Action */}
                            {recommendedAction && (
                                <div
                                    className={`inline-flex items-start rounded-md px-2.5 py-1.5 border ${
                                        isCritical
                                            ? "bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-800"
                                            : isWarning
                                                ? "bg-amber-100 dark:bg-amber-900/50 border-amber-200 dark:border-amber-800"
                                                : "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800"
                                    }`}
                                >
                                    <AlertTriangle
                                        className={`h-3.5 w-3.5 mr-1.5 shrink-0 mt-0.5 ${iconColor}`}
                                    />

                                    <span
                                        className={`text-[0.65rem] font-bold uppercase tracking-wider ${severityColor}`}
                                    >
                                        Action: {recommendedAction}
                                    </span>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}