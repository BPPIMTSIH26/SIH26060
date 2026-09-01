
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const statusColors = {
  ok: "text-emerald-500",
  warn: "text-amber-500",
  danger: "text-red-500",
};

export default function AirQualityList({ airQuality = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 flex flex-col h-full">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Internal AQI</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">CO2 & O2 Levels</span>
      </div>
      <div className="flex-1 space-y-3">
        {airQuality.map((zone, idx) => (
          <div key={idx} className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-3 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {zone.status === "ok" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className={`h-4 w-4 ${statusColors[zone.status] || "text-amber-500"}`} />
                )}
                <span className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">{zone.zone}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1 border-t border-gray-200 dark:border-slate-800 pt-2">
              <div>
                <p className="font-mono text-[0.6rem] uppercase text-gray-500 dark:text-slate-400">CO2 Level</p>
                <p className={`font-mono text-xs font-bold ${zone.status === 'danger' || zone.status === 'warn' ? statusColors[zone.status] : 'text-gray-900 dark:text-slate-100'}`}>
                  {zone.co2}
                </p>
              </div>
              <div>
                <p className="font-mono text-[0.6rem] uppercase text-gray-500 dark:text-slate-400">O2 Level</p>
                <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">{zone.o2}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}