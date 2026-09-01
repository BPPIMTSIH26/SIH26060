// Swapped ServerSnow for Snowflake
import { ShieldCheck, Flame, Droplets, Users, Snowflake } from "lucide-react";

export default function ModuleDiagnostics({ infraJson }) {
  if (!infraJson || !infraJson.modules) return null;

  const { living_quarters: lq, main_lab: lab, storage_module: storage } = infraJson.modules;

  const renderSafetyStatus = (safety) => {
    const isSafe = !safety.fire_alarm_status && safety.smoke_detector_status === "active";
    return (
      <div className="flex items-center gap-1.5">
        {isSafe ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Flame className="w-3.5 h-3.5 text-red-500" />}
        <span className={`font-mono text-xs ${isSafe ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>
          {isSafe ? "Secure" : "Warning"}
        </span>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 h-full flex flex-col">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Module Diagnostics</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Environment & Safety</span>
      </div>

      <div className="flex-1 space-y-3">
        {/* Living Quarters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-4 shadow-sm">
          <div className="w-1/3">
            <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Living Quarters</p>
            <p className="font-mono text-[0.65rem] text-emerald-600 dark:text-emerald-500 uppercase mt-0.5">{lq.status}</p>
          </div>
          <div className="flex gap-4 sm:w-2/3 sm:justify-end">
            <div className="flex flex-col">
              <span className="font-mono text-[0.6rem] uppercase text-gray-500 dark:text-slate-400 mb-1">Humidity/CO2</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-gray-900 dark:text-slate-100">
                <Droplets className="w-3.5 h-3.5 text-cyan-500" /> {lq.environmental?.humidity_percent}% · {lq.environmental?.co2_level_ppm}ppm
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[0.6rem] uppercase text-gray-500 dark:text-slate-400 mb-1">Life Safety</span>
              {renderSafetyStatus(lq.safety)}
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[0.6rem] uppercase text-gray-500 dark:text-slate-400 mb-1">Occupancy</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-gray-900 dark:text-slate-100">
                <Users className="w-3.5 h-3.5 text-blue-500" /> {lq.occupancy?.current_occupants}/{lq.occupancy?.max_capacity}
              </div>
            </div>
          </div>
        </div>

        {/* Main Lab */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-4 shadow-sm">
          <div className="w-1/3">
            <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Main Lab</p>
            <p className="font-mono text-[0.65rem] text-emerald-600 dark:text-emerald-500 uppercase mt-0.5">{lab.status}</p>
          </div>
          <div className="flex gap-4 sm:w-2/3 sm:justify-end">
            <div className="flex flex-col">
              <span className="font-mono text-[0.6rem] uppercase text-gray-500 dark:text-slate-400 mb-1">Humidity</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-gray-900 dark:text-slate-100">
                <Droplets className="w-3.5 h-3.5 text-cyan-500" /> {lab.environmental?.humidity_percent}%
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[0.6rem] uppercase text-gray-500 dark:text-slate-400 mb-1">Life Safety</span>
              {renderSafetyStatus(lab.safety)}
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[0.6rem] uppercase text-gray-500 dark:text-slate-400 mb-1">Freezers</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-gray-900 dark:text-slate-100">
                {/* Applied Snowflake here */}
                <Snowflake className="w-3.5 h-3.5 text-blue-500" /> {lab.equipment?.freezer_units_temp_c}°C
              </div>
            </div>
          </div>
        </div>

        {/* Storage Module */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-4 shadow-sm">
          <div className="w-1/3">
            <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Storage Bay</p>
            <p className="font-mono text-[0.65rem] text-emerald-600 dark:text-emerald-500 uppercase mt-0.5">{storage.status}</p>
          </div>
          <div className="flex gap-4 sm:w-2/3 sm:justify-end">
            <div className="flex flex-col">
              <span className="font-mono text-[0.6rem] uppercase text-gray-500 dark:text-slate-400 mb-1">Capacity</span>
              <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">
                {storage.inventory_storage?.total_capacity_percent}% Full
              </p>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[0.6rem] uppercase text-gray-500 dark:text-slate-400 mb-1">Food Stores</span>
              <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100 capitalize">
                {storage.inventory_storage?.food_storage_status}
              </p>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[0.6rem] uppercase text-gray-500 dark:text-slate-400 mb-1">Med Stores</span>
              <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100 capitalize">
                {storage.inventory_storage?.medical_storage_status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}