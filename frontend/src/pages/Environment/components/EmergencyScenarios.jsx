import { ShieldAlert, AlertOctagon, BellRing } from "lucide-react";

const formatMetric = (val, decimals = 0) => {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return Number(val).toFixed(decimals);
};

export default function EmergencyScenarios({ environmentJson }) {
  if (!environmentJson || !environmentJson.emergency_scenarios) return null;

  const { emergency_scenarios, alerts_local } = environmentJson;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 flex flex-col h-full font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Emergency Protocols</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Live Triggers</span>
      </div>

      <div className="flex-1 space-y-3">
        {alerts_local && alerts_local.length > 0 && alerts_local.map((alert, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30 p-3.5 shadow-sm">
            <BellRing className="h-4 w-4 text-red-600 dark:text-red-500 mt-0.5 shrink-0 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Active Alert</p>
              <p className="text-[0.65rem] font-medium text-red-700 dark:text-red-400 mt-1.5">{alert.message}</p>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">
          <ShieldAlert className={`h-4 w-4 mt-0.5 shrink-0 ${emergency_scenarios.scenario_blizzard_lockdown.current_status === "not_triggered" ? "text-emerald-500" : "text-red-500"}`} />
          <div className="w-full">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Blizzard Lockdown</p>
              <span className={`text-[0.6rem] font-bold uppercase tracking-wider ${emergency_scenarios.scenario_blizzard_lockdown.current_status === "not_triggered" ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"}`}>
                {emergency_scenarios.scenario_blizzard_lockdown.current_status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-[0.65rem] font-medium text-slate-500 dark:text-slate-400">
              Trigger: <span className="font-mono">Wind &gt; {formatMetric(emergency_scenarios.scenario_blizzard_lockdown.trigger_threshold_wind)}km/h</span> & <span className="font-mono">Vis &lt; {formatMetric(emergency_scenarios.scenario_blizzard_lockdown.trigger_threshold_visibility)}m</span>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">
          <AlertOctagon className={`h-4 w-4 mt-0.5 shrink-0 ${emergency_scenarios.scenario_extreme_cold.likelihood === "low" ? "text-emerald-500" : "text-amber-500"}`} />
          <div className="w-full">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Extreme Cold Stress</p>
              <span className={`text-[0.6rem] font-bold uppercase tracking-wider ${emergency_scenarios.scenario_extreme_cold.likelihood === "low" ? "text-emerald-600 dark:text-emerald-500" : "text-amber-600 dark:text-amber-500"}`}>
                Risk: {emergency_scenarios.scenario_extreme_cold.likelihood}
              </span>
            </div>
            <p className="text-[0.65rem] font-medium text-slate-500 dark:text-slate-400">
              {emergency_scenarios.scenario_extreme_cold.estimated_effect}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}