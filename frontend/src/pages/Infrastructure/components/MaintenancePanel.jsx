import { Wrench, HardHat, Server } from "lucide-react";

export default function MaintenancePanel({ infraJson }) {
  if (!infraJson || !infraJson.systems || !infraJson.structural_health) return null;

  const { systems, structural_health } = infraJson;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 h-full flex flex-col font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Maintenance & Core</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subsystems</span>
      </div>

      <div className="flex-1 space-y-3">
        {/* HVAC Maintenance */}
        <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm">
          <Wrench className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <div className="w-full">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Primary HVAC Maintenance</p>
            <div className="flex justify-between items-center mt-1.5">
              <p className="text-[0.65rem] font-medium text-slate-500 dark:text-slate-400">Due in <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{systems.hvac_main.thresholds?.maintenance_due_hours} hrs</span></p>
              <p className="font-mono text-[0.65rem] font-bold text-slate-900 dark:text-slate-100 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded">{systems.hvac_main.thresholds?.next_maintenance_due}</p>
            </div>
          </div>
        </div>

        {/* HVAC Backup */}
        <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm">
          <Server className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
          <div className="w-full">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Secondary Backup Systems</p>
            <p className="text-[0.65rem] font-medium text-slate-500 dark:text-slate-400 mt-1.5 capitalize">
              Status: <span className="font-bold text-cyan-600 dark:text-cyan-400">{systems.hvac_backup?.status}</span>
            </p>
          </div>
        </div>

        {/* Foundation & Roof Sensors */}
        <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm">
          <HardHat className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
          <div className="w-full">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Structural Foundation</p>
            <div className="grid grid-cols-2 mt-1.5">
              <p className="text-[0.65rem] font-medium text-slate-500 dark:text-slate-400 capitalize">
                Base: <span className="font-bold text-emerald-600 dark:text-emerald-500">{structural_health.foundation_status}</span>
              </p>
              <p className="text-[0.65rem] font-medium text-slate-500 dark:text-slate-400 capitalize">
                Strain: <span className="font-bold text-emerald-600 dark:text-emerald-500">{structural_health.roof_strain_sensors}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}