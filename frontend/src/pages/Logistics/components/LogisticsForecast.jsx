import { AlertTriangle, GitMerge, Info } from "lucide-react";

export default function LogisticsForecast({ logisticsJson }) {
  if (!logisticsJson) return null;

  /*
   * Backend response can be passed in either form:
   *
   * 1. Full API response:
   * {
   *   message,
   *   count,
   *   shipments,
   *   data: {...}
   * }
   *
   * 2. Direct dashboard data:
   * {
   *   supplies,
   *   fuel_reserves,
   *   shipments,
   *   interdependencies,
   *   ...
   * }
   */

  const data = logisticsJson?.data || logisticsJson;

  const shipments = data?.shipments || {};
  const interdependencies = data?.interdependencies || {};

  const logisticsForecast = shipments?.logistics_forecast;
  const foodDeps = interdependencies?.food_vs_personnel;
  const fuelDeps = interdependencies?.fuel_vs_operations;

  /*
   * Nothing useful to render.
   */
  if (!logisticsForecast && !foodDeps && !fuelDeps) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 flex flex-col h-full font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Risk Assessment
        </h3>

        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Interdependencies
        </span>
      </div>

      <div className="flex-1 space-y-3">

        {/* Resupply Forecast */}
        {logisticsForecast && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/30 p-3.5 shadow-sm">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />

            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                Resupply Required in{" "}
                <span className="font-mono">
                  {logisticsForecast?.days_until_critical_resupply_needed ?? 0}
                </span>{" "}
                Days
              </p>

              <p className="text-[0.65rem] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                {logisticsForecast?.risk_assessment ||
                  "No current risk assessment available."}
              </p>

              {logisticsForecast?.next_critical_shipment_eta && (
                <p className="text-[0.6rem] font-mono font-bold text-amber-700 dark:text-amber-400 mt-2">
                  Next Critical Shipment:{" "}
                  {new Date(
                    logisticsForecast.next_critical_shipment_eta
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Food vs Personnel */}
        {foodDeps && (
          <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">
            <GitMerge className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />

            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Food vs Personnel
              </p>

              <p className="text-[0.65rem] font-medium text-slate-500 dark:text-slate-400 mt-1">
                {foodDeps?.description ||
                  "Food reserves are monitored against personnel consumption."}
              </p>

              {foodDeps?.resupply_needed_before && (
                <p className="text-[0.6rem] font-mono font-bold text-emerald-600 dark:text-emerald-500 mt-1.5">
                  Resupply Before:{" "}
                  {new Date(
                    foodDeps.resupply_needed_before
                  ).toLocaleDateString()}
                </p>
              )}

              {foodDeps?.current_status && (
                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mt-1">
                  Status: {foodDeps.current_status}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Fuel vs Operations */}
        {fuelDeps && (
          <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">
            <Info className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />

            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Fuel vs Operations
              </p>

              <p className="text-[0.65rem] font-medium text-slate-500 dark:text-slate-400 mt-1">
                {fuelDeps?.description ||
                  "Fuel availability is monitored against station operational requirements."}
              </p>

              {fuelDeps?.emergency_reserve_extends && (
                <p className="text-[0.6rem] font-mono font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
                  Emergency Reserve:{" "}
                  {fuelDeps.emergency_reserve_extends}
                </p>
              )}

              {fuelDeps?.resupply_urgency && (
                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-500 mt-1">
                  Resupply Urgency: {fuelDeps.resupply_urgency}
                </p>
              )}

              {fuelDeps?.recommendation && (
                <p className="text-[0.65rem] font-bold text-cyan-600 dark:text-cyan-500 mt-1.5">
                  {fuelDeps.recommendation}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}