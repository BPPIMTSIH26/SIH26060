const statusColor = {
    ok: "#10b981",
    warn: "#f59e0b",
    warning: "#f59e0b",
    danger: "#ef4444",
    nominal: "#10b981",
    fault: "#ef4444",
    maintenance: "#f59e0b",
};

export default function HealthGauge({ health = {} }) {
    const {
        value = 100,
        trend = "stable",
        breakdown = [],
    } = health;

    const gaugeValue = Math.max(
        0,
        Math.min(100, Number(value) || 0)
    );

    const gaugeColor =
        gaugeValue > 75
            ? statusColor.ok
            : gaugeValue >= 50
                ? statusColor.warn
                : statusColor.danger;

    const r = 52;
    const circumference = 2 * Math.PI * r;
    const dash =
        (gaugeValue / 100) * circumference;

    const getBreakdownColor = (status) => {
        return (
            statusColor[
                status?.toLowerCase()
            ] || statusColor.ok
        );
    };

    const getTrendSymbol = () => {
        if (trend === "improving") return "▲";
        if (trend === "deteriorating") return "▼";
        return "■";
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border p-5 border-slate-200/80 bg-white/70 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 flex flex-col justify-between font-sans transition-colors">

            {/* Background Glow */}
            <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-[0.07] blur-3xl dark:opacity-10"
                style={{
                    backgroundColor: gaugeColor,
                }}
            />

            {/* Header */}
            <h3 className="relative z-10 text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Station Health Index
            </h3>

            <div className="relative z-10 flex items-center gap-5 mt-2">

                {/* Circular Gauge */}
                <div className="relative h-28 w-28 shrink-0 drop-shadow-md">

                    <svg
                        viewBox="0 0 128 128"
                        className="h-full w-full -rotate-90"
                    >
                        {/* Background Circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r={r}
                            fill="none"
                            className="stroke-slate-100 dark:stroke-slate-900"
                            strokeWidth="10"
                        />

                        {/* Progress Circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r={r}
                            fill="none"
                            stroke={gaugeColor}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={`${dash} ${circumference}`}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>

                    {/* Gauge Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">

                        <span
                            className="font-mono text-3xl font-black tabular-nums tracking-tighter"
                            style={{
                                color: gaugeColor,
                            }}
                        >
                            {gaugeValue}
                        </span>

                        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {getTrendSymbol()} {trend}
                        </span>

                    </div>
                </div>

                {/* Breakdown */}
                <div className="flex-1 space-y-2.5">

                    {breakdown.length > 0 ? (
                        breakdown.map((item, index) => {
                            const label =
                                item?.label ||
                                `Metric ${index + 1}`;

                            const metricValue = Math.max(
                                0,
                                Math.min(
                                    100,
                                    Number(item?.value) || 0
                                )
                            );

                            const color =
                                getBreakdownColor(
                                    item?.status
                                );

                            return (
                                <div key={label}>
                                    <div className="mb-1 flex items-center justify-between text-xs font-semibold">

                                        <span className="text-slate-600 dark:text-slate-400">
                                            {label}
                                        </span>

                                        <span
                                            className="font-mono tabular-nums font-bold"
                                            style={{
                                                color,
                                            }}
                                        >
                                            {metricValue}%
                                        </span>

                                    </div>

                                    <div className="h-1.5 overflow-hidden rounded-full border border-slate-200/60 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">

                                        <div
                                            className="relative h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${metricValue}%`,
                                                backgroundColor:
                                                    color,
                                            }}
                                        />

                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center w-full mt-4">
                            All Systems Normal
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}