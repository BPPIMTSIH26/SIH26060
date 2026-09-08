import {
  CloudLightning,
  Sun,
  ShieldAlert,
} from "lucide-react";

export default function WeatherForecast({
  environmentJson,
}) {
  if (
    !environmentJson ||
    !environmentJson.interconnectionsWithOtherSystems
  ) {
    return null;
  }

  const {
    interconnectionsWithOtherSystems:
      interconnections,
    solarConditions,
    weatherPhenomena,
    overallWeatherRisk,
  } = environmentJson;

  const operationsRecommendation =
    interconnections?.impactOnOperations?.recommendations;

  const blizzardWarning =
    weatherPhenomena?.blizzard?.blizzardWarning;

  const solarRadiation =
    solarConditions?.solarRadiationWM2 ?? 0;

  const solarEfficiency =
    solarConditions?.solarPanelEfficiencyPercent ?? 0;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 flex flex-col h-full font-sans">

      {/* Header */}
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Meteorological Impact
        </h3>

        <span
          className={`text-[0.65rem] font-bold uppercase tracking-wider ${
            overallWeatherRisk === "low"
              ? "text-emerald-600 dark:text-emerald-400"
              : overallWeatherRisk === "critical" ||
                overallWeatherRisk === "high"
              ? "text-red-600 dark:text-red-400"
              : "text-amber-600 dark:text-amber-400"
          }`}
        >
          Risk: {overallWeatherRisk ?? "unknown"}
        </span>
      </div>

      <div className="flex-1 space-y-3">

        {/* Operations Alert */}
        <div className="flex items-start gap-3 rounded-xl border border-cyan-200/80 dark:border-cyan-900/50 bg-cyan-50/80 dark:bg-cyan-950/30 p-3.5 shadow-sm">
          <ShieldAlert className="h-4 w-4 text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0" />

          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
              Field Operations
            </p>

            <p className="text-[0.65rem] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              {operationsRecommendation ||
                "No operational recommendations available."}
            </p>
          </div>
        </div>

        {/* Blizzard Status */}
        <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/50 p-3.5 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">

          <CloudLightning
            className={`h-4 w-4 mt-0.5 shrink-0 ${
              blizzardWarning
                ? "text-red-500 dark:text-red-400"
                : "text-amber-500 dark:text-amber-400"
            }`}
          />

          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Blizzard Warning
            </p>

            <p
              className={`text-[0.65rem] font-semibold uppercase tracking-wider mt-1 ${
                blizzardWarning
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {blizzardWarning
                ? "ACTIVE WARNING"
                : "Not Triggered"}
            </p>
          </div>
        </div>

        {/* Solar Conditions */}
        <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/50 p-3.5 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">

          <Sun className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />

          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Solar Array Efficiency
            </p>

            <p className="font-mono text-[0.65rem] font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {solarRadiation} W/m² (
              {solarEfficiency}% Efficiency)
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}