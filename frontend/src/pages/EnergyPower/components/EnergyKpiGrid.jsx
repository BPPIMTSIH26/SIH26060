

const statusColors = { ok: "text-emerald-600 dark:text-emerald-500", warn: "text-amber-600 dark:text-amber-500", danger: "text-red-600 dark:text-red-500" };
const bgColors = { ok: "bg-emerald-500/10", warn: "bg-amber-500/10", danger: "bg-red-500/10" };

export default function EnergyKpiGrid({ kpis = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div key={idx} className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/60 p-5 shadow-sm transition-colors duration-300">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${bgColors[kpi.status] || "bg-gray-500/10"}`}>
              {Icon && <Icon className={`h-6 w-6 ${statusColors[kpi.status] || "text-gray-500"}`} />}
            </div>
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">{kpi.label}</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="font-mono text-xl font-bold text-gray-900 dark:text-slate-100">{kpi.value}</p>
                {kpi.subtext && (
                  <span className={`font-mono text-[0.6rem] uppercase tracking-wider ${statusColors[kpi.status]}`}>
                    {kpi.subtext}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}