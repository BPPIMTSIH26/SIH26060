/* eslint-disable no-unused-vars */
import React from "react";
import { CloudSnow, Droplets, SunDim, Wind } from "lucide-react";

export default function SnowAndAtmosphere({ environmentJson }) {
  if (!environmentJson || !environmentJson.weather_phenomena) return null;

  const { precipitation, atmospheric } = environmentJson.weather_phenomena;
  const { solar_conditions, exterior_conditions } = environmentJson;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 flex flex-col h-full">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Glaciology & Atmosphere</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">
          {solar_conditions?.seasonal_phase.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {/* Snow Depth */}
        <div className="flex flex-col justify-center p-3 rounded-lg border border-cyan-200 dark:border-cyan-900/30 bg-cyan-50 dark:bg-cyan-950/20">
          <CloudSnow className="h-4 w-4 text-cyan-600 dark:text-cyan-500 mb-2" />
          <span className="font-mono text-lg font-bold text-gray-900 dark:text-slate-100">
            {precipitation?.total_snow_depth_on_ground_cm} cm
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Base Snow Depth</span>
          <span className="font-mono text-[0.6rem] text-cyan-600 dark:text-cyan-500 mt-1">
            +{precipitation?.snow_accumulation_today_mm} mm today
          </span>
        </div>

        {/* Daylight / Solar */}
        <div className="flex flex-col justify-center p-3 rounded-lg border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20">
          <SunDim className="h-4 w-4 text-amber-500 mb-2" />
          <span className="font-mono text-lg font-bold text-gray-900 dark:text-slate-100">
            {solar_conditions?.daylight_hours} hrs
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Daylight Remaining</span>
        </div>

        {/* Ozone Levels */}
        <div className="flex flex-col justify-center p-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50">
          <Wind className="h-4 w-4 text-emerald-500 mb-2" />
          <span className="font-mono text-lg font-bold text-gray-900 dark:text-slate-100">
            {atmospheric?.ozone_level_dobson_units} DU
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Ozone Level</span>
        </div>

        {/* Humidity */}
        <div className="flex flex-col justify-center p-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50">
          <Droplets className="h-4 w-4 text-blue-500 mb-2" />
          <span className="font-mono text-lg font-bold text-gray-900 dark:text-slate-100">
            {atmospheric?.humidity_percent}%
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Exterior Humidity</span>
        </div>
      </div>
    </div>
  );
}