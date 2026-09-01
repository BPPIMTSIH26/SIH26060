import { AlertTriangle, GitMerge, Info } from "lucide-react";

export default function LogisticsForecast({ logisticsJson }) {
  // Defensive check: ensure the base objects exist before rendering
  if (!logisticsJson || !logisticsJson.interdependencies || !logisticsJson.shipments) {
    return null; 
  }

  // CORRECTED: Extract logistics_forecast from inside shipments
  const { logistics_forecast } = logisticsJson.shipments;
  const foodDeps = logisticsJson.interdependencies.food_vs_personnel;
  const fuelDeps = logisticsJson.interdependencies.fuel_vs_operations;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 flex flex-col h-full">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Risk Assessment</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Interdependencies</span>
      </div>

      <div className="flex-1 space-y-3">
        
        {/* Forecast Alert (Using optional chaining '?.' just to be safe!) */}
        {logistics_forecast && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-100/50 dark:bg-amber-950/30 p-3 shadow-sm">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100 mb-1">
                Resupply Required in {logistics_forecast.days_until_critical_resupply_needed} Days
              </p>
              <p className="font-mono text-[0.65rem] text-gray-600 dark:text-slate-400 leading-relaxed">
                {logistics_forecast.risk_assessment}
              </p>
            </div>
          </div>
        )}

        {/* Food vs Personnel */}
        {foodDeps && (
          <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-3 shadow-sm">
            <GitMerge className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Food vs Personnel</p>
              <p className="font-mono text-[0.65rem] text-gray-500 dark:text-slate-400 mt-1">{foodDeps.description}</p>
            </div>
          </div>
        )}

        {/* Fuel vs Operations */}
        {fuelDeps && (
          <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-3 shadow-sm">
            <Info className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Fuel vs Operations</p>
              <p className="font-mono text-[0.65rem] text-gray-500 dark:text-slate-400 mt-1">{fuelDeps.description}</p>
              <p className="font-mono text-[0.65rem] font-semibold text-cyan-600 dark:text-cyan-500 mt-1">{fuelDeps.recommendation}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}