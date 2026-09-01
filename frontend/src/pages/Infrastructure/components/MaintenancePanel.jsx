import { Wrench, HardHat, Server } from "lucide-react";

export default function MaintenancePanel({ infraJson }) {
  if (!infraJson || !infraJson.systems || !infraJson.structural_health) return null;

  const { systems, structural_health } = infraJson;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 h-full flex flex-col">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Maintenance & Core</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Subsystems</span>
      </div>

      <div className="flex-1 space-y-3">
        {/* HVAC Maintenance */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-3 shadow-sm">
          <Wrench className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <div className="w-full">
            <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Primary HVAC Maintenance</p>
            <div className="flex justify-between mt-1">
              <p className="font-mono text-[0.65rem] text-gray-500 dark:text-slate-400">Due in {systems.hvac_main.thresholds?.maintenance_due_hours} hrs</p>
              <p className="font-mono text-[0.65rem] font-bold text-gray-900 dark:text-slate-100">{systems.hvac_main.thresholds?.next_maintenance_due}</p>
            </div>
          </div>
        </div>

        {/* HVAC Backup */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-3 shadow-sm">
          <Server className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
          <div className="w-full">
            <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Secondary Backup Systems</p>
            <p className="font-mono text-[0.65rem] text-gray-500 dark:text-slate-400 mt-1 capitalize">
              Status: <span className="font-bold text-cyan-600 dark:text-cyan-500">{systems.hvac_backup?.status}</span>
            </p>
          </div>
        </div>

        {/* Foundation & Roof Sensors */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-3 shadow-sm">
          <HardHat className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
          <div className="w-full">
            <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Structural Foundation</p>
            <div className="grid grid-cols-2 mt-1">
              <p className="font-mono text-[0.65rem] text-gray-500 dark:text-slate-400 capitalize">
                Base: <span className="font-bold text-emerald-600 dark:text-emerald-500">{structural_health.foundation_status}</span>
              </p>
              <p className="font-mono text-[0.65rem] text-gray-500 dark:text-slate-400 capitalize">
                Strain: <span className="font-bold text-emerald-600 dark:text-emerald-500">{structural_health.roof_strain_sensors}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}