import { ShieldCheck, Flame, Droplets, Users, Snowflake } from "lucide-react";

export default function ModuleDiagnostics({ infraJson }) {
  if (!infraJson || !infraJson.modules) return null;

  const { living_quarters: lq, main_lab: lab, storage_module: storage } = infraJson.modules;

  const renderSafetyStatus = (safety) => {
    const isSafe = !safety.fire_alarm_status && safety.smoke_detector_status === "active";
    return (
      <div className="flex items-center gap-1.5 mt-0.5">
        {isSafe ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Flame className="w-3.5 h-3.5 text-red-500" />}
        <span className={`text-[0.65rem] font-bold uppercase tracking-wider ${isSafe ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'}`}>
          {isSafe ? "Secure" : "Warning"}
        </span>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 h-full flex flex-col font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Module Diagnostics</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Environment & Safety</span>
      </div>

      <div className="flex-1 space-y-3">
        {/* Living Quarters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-4 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">
          <div className="w-1/3">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Living Quarters</p>
            <p className="text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-500 uppercase mt-0.5">{lq.status}</p>
          </div>
          <div className="flex gap-4 sm:w-2/3 sm:justify-end">
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Humidity/CO2</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                <Droplets className="w-3.5 h-3.5 text-cyan-500 shrink-0" /> {lq.environmental?.humidity_percent}% · {lq.environmental?.co2_level_ppm}ppm
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Life Safety</span>
              {renderSafetyStatus(lq.safety)}
            </div>
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Occupancy</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {lq.occupancy?.current_occupants}/{lq.occupancy?.max_capacity}
              </div>
            </div>
          </div>
        </div>

        {/* Main Lab */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-4 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">
          <div className="w-1/3">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Main Lab</p>
            <p className="text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-500 uppercase mt-0.5">{lab.status}</p>
          </div>
          <div className="flex gap-4 sm:w-2/3 sm:justify-end">
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Humidity</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                <Droplets className="w-3.5 h-3.5 text-cyan-500 shrink-0" /> {lab.environmental?.humidity_percent}%
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Life Safety</span>
              {renderSafetyStatus(lab.safety)}
            </div>
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Freezers</span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                <Snowflake className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {lab.equipment?.freezer_units_temp_c}°C
              </div>
            </div>
          </div>
        </div>

        {/* Storage Module */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-4 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">
          <div className="w-1/3">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Storage Bay</p>
            <p className="text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-500 uppercase mt-0.5">{storage.status}</p>
          </div>
          <div className="flex gap-4 sm:w-2/3 sm:justify-end">
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Capacity</span>
              <p className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                {storage.inventory_storage?.total_capacity_percent}% Full
              </p>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Food Stores</span>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 capitalize">
                {storage.inventory_storage?.food_storage_status}
              </p>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Med Stores</span>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 capitalize">
                {storage.inventory_storage?.medical_storage_status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}