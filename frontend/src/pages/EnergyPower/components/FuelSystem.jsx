
import { Fuel, ShieldCheck } from "lucide-react";

export default function FuelSystem({ energyJson }) {
  if (!energyJson || !energyJson.fuel_system) return null;
  const { primary_tank, emergency_reserve } = energyJson.fuel_system;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 h-full flex flex-col">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Fuel Subsystem</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Tank Levels</span>
      </div>
      <div className="flex-1 space-y-3">
        {/* Primary Tank */}
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-3 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-cyan-500" />
              <span className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Primary Storage</span>
            </div>
            <span className="font-mono text-[0.65rem] uppercase text-cyan-600 dark:text-cyan-500 font-bold">{primary_tank.days_until_empty} Days Left</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-cyan-500" style={{ width: `${primary_tank.current_level_percent}%` }} />
          </div>
          <div className="flex justify-between font-mono text-[0.6rem] text-gray-500 dark:text-slate-400 mt-1">
            <span>{primary_tank.current_level_liters.toLocaleString()} L</span>
            <span>Burn: {primary_tank.consumption_rate_liters_per_day} L/day</span>
          </div>
        </div>

        {/* Emergency Reserve */}
        <div className="flex flex-col gap-2 rounded-lg border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 p-3 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-400">Emergency Reserve</span>
            </div>
            <span className="font-mono text-[0.65rem] uppercase text-emerald-600 dark:text-emerald-500 font-bold">LOCKED</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-200 dark:bg-emerald-900/50">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `100%` }} />
          </div>
          <p className="font-mono text-[0.6rem] text-emerald-700 dark:text-emerald-500 mt-1">{emergency_reserve.reserve_purpose}</p>
        </div>
      </div>
    </div>
  );
}