
import { CloudLightning, Sun, ShieldAlert } from "lucide-react";

export default function WeatherForecast({ environmentJson }) {
  if (!environmentJson || !environmentJson.interconnections_with_other_systems) return null;

  const { interconnections_with_other_systems: interconnections, solar_conditions, weather_phenomena, overall_weather_risk } = environmentJson;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 flex flex-col h-full">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Meteorological Impact</h3>
        <span className={`font-mono text-[0.6rem] uppercase tracking-wider font-bold ${overall_weather_risk === "low" ? "text-emerald-500" : "text-amber-500"}`}>
          Risk: {overall_weather_risk}
        </span>
      </div>

      <div className="flex-1 space-y-3">
        {/* Operations Alert */}
        <div className="flex items-start gap-3 rounded-lg border border-cyan-200 dark:border-cyan-900/50 bg-cyan-50/80 dark:bg-cyan-950/30 p-3 shadow-sm">
          <ShieldAlert className="h-4 w-4 text-cyan-600 dark:text-cyan-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100 mb-1">Field Operations</p>
            <p className="font-mono text-[0.65rem] text-gray-600 dark:text-slate-400 leading-relaxed">
              {interconnections.impact_on_operations?.recommendations}
            </p>
          </div>
        </div>

        {/* Blizzard Status */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-3 shadow-sm">
          <CloudLightning className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Blizzard Warning</p>
            <p className="font-mono text-[0.65rem] text-gray-500 dark:text-slate-400 mt-1">
              {weather_phenomena?.blizzard?.blizzard_warning ? "ACTIVE WARNING" : "Not Triggered"}
            </p>
          </div>
        </div>

        {/* Solar Conditions */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-3 shadow-sm">
          <Sun className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Solar Array Efficiency</p>
            <p className="font-mono text-[0.65rem] text-gray-500 dark:text-slate-400 mt-1">
              {solar_conditions?.solar_radiation_w_m2} W/m² ({solar_conditions?.solar_panel_efficiency_percent}% Efficiency)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}