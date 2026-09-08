import {
    Zap,
    Battery,
    Activity,
    Fuel,
} from "lucide-react";

const getStatusClasses = (status) => {
    switch (status) {
        case "danger":
            return {
                wrapper:
                    "border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20",
                icon:
                    "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",
                value:
                    "text-red-700 dark:text-red-400",
                status:
                    "text-red-600 dark:text-red-400",
            };

        case "warn":
            return {
                wrapper:
                    "border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20",
                icon:
                    "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
                value:
                    "text-amber-700 dark:text-amber-400",
                status:
                    "text-amber-600 dark:text-amber-400",
            };

        default:
            return {
                wrapper:
                    "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900",
                icon:
                    "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
                value:
                    "text-gray-900 dark:text-white",
                status:
                    "text-emerald-600 dark:text-emerald-400",
            };
    }
};

export default function EnergyKpiGrid({
    kpis = [],
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;

                const styles = getStatusClasses(
                    kpi.status
                );

                return (
                    <div
                        key={kpi.label}
                        className={`rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md ${styles.wrapper}`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                                    {kpi.label}
                                </p>

                                <p
                                    className={`mt-2 text-2xl font-bold ${styles.value}`}
                                >
                                    {kpi.value}
                                </p>

                                <p
                                    className={`mt-1 text-xs font-semibold uppercase tracking-wide ${styles.status}`}
                                >
                                    {kpi.subtext}
                                </p>
                            </div>

                            <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
                            >
                                <Icon
                                    className="h-5 w-5"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}