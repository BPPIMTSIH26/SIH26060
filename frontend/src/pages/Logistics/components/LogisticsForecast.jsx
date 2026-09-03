import { AlertTriangle, GitMerge, Info } from "lucide-react";

export default function LogisticsForecast({ logisticsJson }) {
  if (!logisticsJson || !logisticsJson.interdependencies || !logisticsJson.shipments) {
    return null; 
  }

  const { logistics_forecast } = logisticsJson.shipments;
  const foodDeps = logisticsJson.interdependencies.food_vs_personnel;
  const fuelDeps = logisticsJson.interdependencies.fuel_vs_operations;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 flex flex-col h-full font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Risk Assessment</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Interdependencies</span>
      </div>

      <div className="flex-1 space-y-3">
        {logistics_forecast && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/30 p-3.5 shadow-sm">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                Resupply Required in <span className="font-mono">{logistics_forecast.days_until_critical_resupply_needed}</span> Days
              </p>
              <p className="text-[0.65rem] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                {logistics_forecast.risk_assessment}
              </p>
            </div>
          </div>
        )}

        {foodDeps && (
          <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">
            <GitMerge className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Food vs Personnel</p>
              <p className="text-[0.65rem] font-medium text-slate-500 dark:text-slate-400 mt-1">{foodDeps.description}</p>
            </div>
          </div>
        )}

        {fuelDeps && (
          <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">
            <Info className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Fuel vs Operations</p>
              <p className="text-[0.65rem] font-medium text-slate-500 dark:text-slate-400 mt-1">{fuelDeps.description}</p>
              <p className="text-[0.65rem] font-bold text-cyan-600 dark:text-cyan-500 mt-1.5">{fuelDeps.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}