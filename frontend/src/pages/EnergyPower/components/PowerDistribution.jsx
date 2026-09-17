import { Activity } from "lucide-react";

const formatMetric = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return Number(val).toFixed(decimals);
};

export default function PowerDistribution({ energyJson }) {
  if (!energyJson || !energyJson.power_distribution) return null;
  const { loads_by_section, thresholds, total_load_kw } = energyJson.power_distribution;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 h-full flex flex-col font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Load Distribution</h3>
        <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Max Grid Capacity: {formatMetric(thresholds.max_load_kw, 0)} kW
        </span>
      </div>
      <div className="flex-1 space-y-3.5">
        {Object.entries(loads_by_section).map(([key, data]) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-1/3">
              <Activity className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 truncate">{key.replace('_', ' ')}</span>
            </div>
            <div className="w-1/3 flex items-center">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${formatMetric(data.percent_of_total, 1)}%` }} />
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 w-1/4 text-right tabular-nums">
              {formatMetric(data.load_kw, 1)} kW
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Total System Load</span>
        <span className={`font-mono text-sm font-bold bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-md ${total_load_kw >= thresholds.warning_load_kw ? 'text-amber-500' : 'text-emerald-500'}`}>
          {formatMetric(total_load_kw, 1)} kW
        </span>
      </div>
    </div>
  );
}