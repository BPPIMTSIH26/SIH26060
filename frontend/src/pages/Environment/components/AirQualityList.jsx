import { AlertTriangle, CheckCircle2 } from "lucide-react";

const statusColors = {
  ok: "text-emerald-500",
  warn: "text-amber-500",
  danger: "text-red-500",
};

export default function AirQualityList({ airQuality = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 flex flex-col h-full font-sans">

      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Internal AQI
        </h3>

        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          CO2 & O2 Levels
        </span>
      </div>

      <div className="flex-1 space-y-3">

        {airQuality.map((zone, idx) => {
          const status = zone?.status || "ok";

          return (
            <div
              key={zone?.id || idx}
              className="flex flex-col gap-2 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm transition-colors duration-300 hover:bg-white dark:hover:bg-slate-900"
            >

              {/* Zone Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">

                  {status === "ok" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        statusColors[status] || "text-amber-500"
                      }`}
                    />
                  )}

                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {zone?.zone || "Unknown Zone"}
                  </span>

                </div>
              </div>

              {/* Air Quality Values */}
              <div className="grid grid-cols-2 gap-2 mt-1 border-t border-slate-200 dark:border-slate-700/80 pt-2.5">

                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    CO2 Level
                  </p>

                  <p
                    className={`font-mono text-sm font-bold mt-0.5 ${
                      status === "danger" || status === "warn"
                        ? statusColors[status]
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {zone?.co2 ?? "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    O2 Level
                  </p>

                  <p className="font-mono text-sm font-bold mt-0.5 text-slate-900 dark:text-slate-100">
                    {zone?.o2 ?? "N/A"}
                  </p>
                </div>

              </div>
            </div>
          );
        })}

        {airQuality.length === 0 && (
          <div className="flex items-center justify-center h-full min-h-[160px]">
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
              No internal air-quality data available.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}