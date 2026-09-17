import { Fuel, ShieldCheck } from "lucide-react";

const formatMetric = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return Number(val).toFixed(decimals);
};

export default function FuelSystem({ energyJson }) {
  if (!energyJson || !energyJson.fuel_system) return null;
  const { primary_tank, emergency_reserve } = energyJson.fuel_system;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 h-full flex flex-col font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Fuel Subsystem</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tank Levels</span>
      </div>
      <div className="flex-1 space-y-3">
        {/* Primary Tank */}
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-4 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-cyan-500 shrink-0" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Primary Storage</span>
            </div>
            <span className="font-mono text-[0.65rem] uppercase text-cyan-600 dark:text-cyan-500 font-bold">{formatMetric(primary_tank.days_until_empty, 1)} Days Left</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-cyan-500" style={{ width: `${formatMetric(primary_tank.current_level_percent, 1)}%` }} />
          </div>
          <div className="flex justify-between font-mono text-[0.65rem] text-slate-500 dark:text-slate-400 mt-1">
            <span>{Number(formatMetric(primary_tank.current_level_liters, 0)).toLocaleString()} L</span>
            <span>Burn: {formatMetric(primary_tank.consumption_rate_liters_per_day, 0)} L/day</span>
          </div>
        </div>

        {/* Emergency Reserve */}
        <div className="flex flex-col gap-2 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/30 p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Emergency Reserve</span>
            </div>
            <span className="text-[0.65rem] uppercase text-emerald-600 dark:text-emerald-500 font-bold">LOCKED</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-200 dark:bg-emerald-900/50">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `100%` }} />
          </div>
          <p className="text-[0.65rem] font-medium text-emerald-700 dark:text-emerald-500 mt-1">{emergency_reserve.reserve_purpose}</p>
        </div>
      </div>
    </div>
  );
}