
import { Activity } from "lucide-react";

export default function PowerDistribution({ energyJson }) {
  if (!energyJson || !energyJson.power_distribution) return null;
  const { loads_by_section, thresholds, total_load_kw } = energyJson.power_distribution;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 h-full flex flex-col">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Load Distribution</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">
          Max Grid Capacity: {thresholds.max_load_kw} kW
        </span>
      </div>
      <div className="flex-1 space-y-3">
        {Object.entries(loads_by_section).map(([key, data]) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-1/3">
              <Activity className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-mono text-[0.65rem] uppercase text-gray-600 dark:text-slate-300">{key.replace('_', ' ')}</span>
            </div>
            <div className="w-1/3 flex items-center">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${data.percent_of_total}%` }} />
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100 w-1/4 text-right tabular-nums">
              {data.load_kw.toFixed(1)} kW
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-800 flex justify-between">
        <span className="font-mono text-[0.65rem] uppercase text-gray-500">Total System Load</span>
        <span className={`font-mono text-xs font-bold ${total_load_kw >= thresholds.warning_load_kw ? 'text-amber-500' : 'text-emerald-500'}`}>
          {total_load_kw.toFixed(1)} kW
        </span>
      </div>
    </div>
  );
}