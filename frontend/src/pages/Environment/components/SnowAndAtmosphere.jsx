import { CloudSnow, Droplets, SunDim, Wind } from "lucide-react";

const formatMetric = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return Number(val).toFixed(decimals);
};

export default function SnowAndAtmosphere({ environmentJson }) {
  if (!environmentJson || !environmentJson.weather_phenomena) return null;

  const { precipitation, atmospheric } = environmentJson.weather_phenomena;
  const { solar_conditions } = environmentJson;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 flex flex-col h-full font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Glaciology & Atmosphere</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {solar_conditions?.seasonal_phase?.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {/* Snow Depth */}
        <div className="flex flex-col justify-center p-4 rounded-xl border border-cyan-200/80 dark:border-cyan-900/40 bg-cyan-50/50 dark:bg-cyan-950/30">
          <CloudSnow className="h-4 w-4 text-cyan-600 dark:text-cyan-400 mb-2.5" />
          <span className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100">
            {formatMetric(precipitation?.total_snow_depth_on_ground_cm, 1)} cm
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">Base Snow Depth</span>
          <span className="font-mono text-[0.65rem] font-semibold text-cyan-600 dark:text-cyan-400 mt-1.5">
            +{formatMetric(precipitation?.snow_accumulation_today_mm, 1)} mm today
          </span>
        </div>

        {/* Daylight / Solar */}
        <div className="flex flex-col justify-center p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/30">
          <SunDim className="h-4 w-4 text-amber-500 dark:text-amber-400 mb-2.5" />
          <span className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100">
            {formatMetric(solar_conditions?.daylight_hours, 1)} hrs
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">Daylight Remaining</span>
        </div>

        {/* Ozone Levels */}
        <div className="flex flex-col justify-center p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/50">
          <Wind className="h-4 w-4 text-emerald-500 dark:text-emerald-400 mb-2.5" />
          <span className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100">
            {formatMetric(atmospheric?.ozone_level_dobson_units, 0)} DU
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">Ozone Level</span>
        </div>

        {/* Humidity */}
        <div className="flex flex-col justify-center p-4 rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/50">
          <Droplets className="h-4 w-4 text-blue-500 dark:text-blue-400 mb-2.5" />
          <span className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100">
            {formatMetric(atmospheric?.humidity_percent, 0)}%
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">Exterior Humidity</span>
        </div>
      </div>
    </div>
  );
}