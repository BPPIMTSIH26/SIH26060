import { Activity } from "lucide-react";

export default function PowerDistribution({ energyJson }) {
    if (!energyJson || !energyJson.power_distribution) {
        return null;
    }

    const {
        loads_by_section = {},
        thresholds = {},
        total_load_kw = 0,
    } = energyJson.power_distribution;

    const maxLoad = thresholds.max_load_kw ?? 400;
    const warningLoad = thresholds.warning_load_kw ?? 350;

    const safeTotalLoad = Number(total_load_kw) || 0;

    const getStatusColor = (load) => {
        if (load >= maxLoad) {
            return "bg-red-500";
        }

        if (load >= warningLoad) {
            return "bg-amber-500";
        }

        return "bg-emerald-500";
    };

    const getStatusTextColor = (load) => {
        if (load >= maxLoad) {
            return "text-red-500";
        }

        if (load >= warningLoad) {
            return "text-amber-500";
        }

        return "text-emerald-500";
    };

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 h-full flex flex-col font-sans">

            {/* Header */}
            <div className="mb-4 flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Load Distribution
                </h3>

                <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    Max Grid Capacity: {maxLoad} kW
                </span>
            </div>

            {/* Load Sections */}
            <div className="flex-1 space-y-3.5">

                {Object.entries(loads_by_section).map(([key, section]) => {
                    const load = Number(section?.load_kw) || 0;
                    const percentage = Number(section?.percent_of_total) || 0;

                    const safePercentage = Math.max(
                        0,
                        Math.min(100, percentage)
                    );

                    return (
                        <div
                            key={key}
                            className="flex items-center justify-between gap-3"
                        >
                            {/* Section Name */}
                            <div className="flex items-center gap-2 w-1/3 min-w-0">
                                <Activity className="h-3.5 w-3.5 text-slate-400 shrink-0" />

                                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 truncate">
                                    {key.replace(/_/g, " ")}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-1/3 flex items-center">
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${getStatusColor(
                                            load
                                        )}`}
                                        style={{
                                            width: `${safePercentage}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Load Value */}
                            <span
                                className={`font-mono text-xs font-bold w-1/4 text-right tabular-nums ${
                                    load >= warningLoad
                                        ? getStatusTextColor(load)
                                        : "text-slate-900 dark:text-slate-100"
                                }`}
                            >
                                {load.toFixed(1)} kW
                            </span>
                        </div>
                    );
                })}

                {Object.keys(loads_by_section).length === 0 && (
                    <div className="flex flex-1 items-center justify-center">
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                            No load distribution telemetry available.
                        </p>
                    </div>
                )}
            </div>

            {/* Total Load */}
            <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Total System Load
                </span>

                <span
                    className={`font-mono text-sm font-bold px-2.5 py-1 rounded-md ${
                        safeTotalLoad >= warningLoad
                            ? safeTotalLoad >= maxLoad
                                ? "bg-red-500/10 text-red-500"
                                : "bg-amber-500/10 text-amber-500"
                            : "bg-emerald-500/10 text-emerald-500"
                    }`}
                >
                    {safeTotalLoad.toFixed(1)} kW
                </span>
            </div>
        </div>
    );
}