import { Flame, Sun } from "lucide-react";

const statusColors = {
    ACTIVE: "text-emerald-600 dark:text-emerald-500",
    STANDBY: "text-amber-600 dark:text-amber-500",
    STARTING: "text-cyan-600 dark:text-cyan-500",
    SHUTDOWN: "text-slate-600 dark:text-slate-400",
    FAULT: "text-red-600 dark:text-red-500",
    MAINTENANCE: "text-amber-600 dark:text-amber-500",
    OPERATIONAL: "text-emerald-600 dark:text-emerald-500",
};

const bgColors = {
    ACTIVE: "bg-emerald-500/10",
    STANDBY: "bg-amber-500/10",
    STARTING: "bg-cyan-500/10",
    SHUTDOWN: "bg-slate-500/10",
    FAULT: "bg-red-500/10",
    MAINTENANCE: "bg-amber-500/10",
    OPERATIONAL: "bg-emerald-500/10",
};

const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function PowerSourcesTable({ sources = [] }) {
    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 overflow-x-auto h-full font-sans">

            {/* Header */}
            <div className="mb-4 flex items-baseline justify-between min-w-[650px]">
                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Active Power Sources
                </h3>

                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Generator Telemetry
                </span>
            </div>

            {/* Table */}
            <table className="w-full text-left text-sm min-w-[650px]">

                <thead className="border-b border-slate-200 dark:border-slate-700/80 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <tr>
                        <th className="pb-3">
                            Source ID
                        </th>

                        <th className="pb-3">
                            Status
                        </th>

                        <th className="pb-3">
                            Live Output
                        </th>

                        <th className="pb-3">
                            Efficiency / Fuel
                        </th>

                        <th className="pb-3">
                            Maintenance / Runtime
                        </th>

                        <th className="pb-3 text-right">
                            State
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">

                    {sources.length > 0 ? (
                        sources.map((src, index) => {
                            const status =
                                src?.status?.toUpperCase() ||
                                "SHUTDOWN";

                            const statusText =
                                statusColors[status] ||
                                "text-slate-500";

                            const statusBg =
                                bgColors[status] ||
                                "bg-slate-500/10";

                            const isGenerator =
                                src?.id?.toUpperCase()?.includes("GEN") ||
                                src?.type
                                    ?.toLowerCase()
                                    ?.includes("generator");

                            return (
                                <tr
                                    key={src?.id || index}
                                    className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
                                >

                                    {/* Source ID */}
                                    <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                                        <div className="flex items-center gap-2">

                                            {isGenerator ? (
                                                <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                                            ) : (
                                                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                                            )}

                                            <span>
                                                {src?.id || "UNKNOWN"}
                                            </span>

                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="py-3.5">
                                        <span
                                            className={`text-xs font-semibold uppercase tracking-wider ${statusText}`}
                                        >
                                            {formatStatus(status)}
                                        </span>
                                    </td>

                                    {/* Live Output */}
                                    <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">

                                        {src?.output ?? 0} kW

                                        {src?.maxOutput !== undefined &&
                                            src?.maxOutput !== null && (
                                                <span className="block text-[0.6rem] font-medium text-slate-500 font-sans mt-0.5">
                                                    Max: {src.maxOutput} kW
                                                </span>
                                            )}

                                    </td>

                                    {/* Efficiency / Fuel */}
                                    <td className="py-3.5 font-mono text-slate-600 dark:text-slate-300">

                                        <div>
                                            {src?.efficiency !== undefined &&
                                            src?.efficiency !== null
                                                ? `${src.efficiency}%`
                                                : "N/A"}
                                        </div>

                                        {src?.fuelConsumption !==
                                            undefined &&
                                            src?.fuelConsumption !== null && (
                                                <div className="text-[0.6rem] text-slate-500 mt-0.5">
                                                    {src.fuelConsumption} L/h
                                                </div>
                                            )}

                                    </td>

                                    {/* Maintenance / Runtime */}
                                    <td className="py-3.5 text-slate-600 dark:text-slate-300">

                                        {src?.runtime !== undefined &&
                                        src?.runtime !== null ? (
                                            <>
                                                <div className="font-mono text-xs">
                                                    {src.runtime}h Total
                                                </div>

                                                {src?.maintDue !==
                                                    undefined &&
                                                    src?.maintDue !== null && (
                                                        <div className="font-semibold text-[0.65rem] text-amber-600 dark:text-amber-500 mt-0.5">
                                                            Due in{" "}
                                                            {src.maintDue}h
                                                        </div>
                                                    )}
                                            </>
                                        ) : (
                                            <span className="text-xs">
                                                N/A
                                            </span>
                                        )}

                                    </td>

                                    {/* State */}
                                    <td className="py-3.5 text-right">

                                        <span
                                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${statusBg} ${statusText}`}
                                        >
                                            {formatStatus(status)}
                                        </span>

                                    </td>

                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td
                                colSpan={6}
                                className="py-10 text-center text-sm font-medium text-slate-400 dark:text-slate-500"
                            >
                                No power source telemetry available.
                            </td>
                        </tr>
                    )}

                </tbody>
            </table>
        </div>
    );
}