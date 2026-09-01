
import { ShieldAlert, AlertOctagon, BellRing } from "lucide-react";

export default function EmergencyScenarios({ environmentJson }) {
  if (!environmentJson || !environmentJson.emergency_scenarios) return null;

  const { emergency_scenarios, alerts_local } = environmentJson;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 flex flex-col h-full">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Emergency Protocols</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Live Triggers</span>
      </div>

      <div className="flex-1 space-y-3">
        {/* Active Local Alerts (if any exist) */}
        {alerts_local && alerts_local.length > 0 && alerts_local.map((alert, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3 shadow-sm">
            <BellRing className="h-4 w-4 text-red-600 dark:text-red-500 mt-0.5 shrink-0 animate-pulse" />
            <div>
              <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider">Active Alert</p>
              <p className="font-mono text-[0.65rem] text-red-700 dark:text-red-400 mt-1">{alert.message}</p>
            </div>
          </div>
        ))}

        {/* Blizzard Lockdown Protocol */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-3 shadow-sm">
          <ShieldAlert className={`h-4 w-4 mt-0.5 shrink-0 ${emergency_scenarios.scenario_blizzard_lockdown.current_status === "not_triggered" ? "text-emerald-500" : "text-red-500"}`} />
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Blizzard Lockdown</p>
              <span className={`font-mono text-[0.6rem] uppercase font-bold ${emergency_scenarios.scenario_blizzard_lockdown.current_status === "not_triggered" ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"}`}>
                {emergency_scenarios.scenario_blizzard_lockdown.current_status.replace('_', ' ')}
              </span>
            </div>
            <p className="font-mono text-[0.65rem] text-gray-500 dark:text-slate-400">
              Trigger: Wind &gt; {emergency_scenarios.scenario_blizzard_lockdown.trigger_threshold_wind}km/h & Vis &lt; {emergency_scenarios.scenario_blizzard_lockdown.trigger_threshold_visibility}m
            </p>
          </div>
        </div>

        {/* Extreme Cold Protocol */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-3 shadow-sm">
          <AlertOctagon className={`h-4 w-4 mt-0.5 shrink-0 ${emergency_scenarios.scenario_extreme_cold.likelihood === "low" ? "text-emerald-500" : "text-amber-500"}`} />
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Extreme Cold Stress</p>
              <span className={`font-mono text-[0.6rem] uppercase font-bold ${emergency_scenarios.scenario_extreme_cold.likelihood === "low" ? "text-emerald-600 dark:text-emerald-500" : "text-amber-600 dark:text-amber-500"}`}>
                Risk: {emergency_scenarios.scenario_extreme_cold.likelihood}
              </span>
            </div>
            <p className="font-mono text-[0.65rem] text-gray-500 dark:text-slate-400">
              {emergency_scenarios.scenario_extreme_cold.estimated_effect}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}