// Internalized color maps to remove external file dependencies
const statusColors = {
  ok: "text-emerald-600 dark:text-emerald-500",
  warn: "text-amber-600 dark:text-amber-500",
  danger: "text-red-600 dark:text-red-500",
  secure: "text-emerald-600 dark:text-emerald-500",
  maintenance: "text-amber-600 dark:text-amber-500",
  nominal: "text-emerald-600 dark:text-emerald-500"
};

const bgColors = {
  ok: "bg-emerald-500/10",
  warn: "bg-amber-500/10",
  danger: "bg-red-500/10",
  secure: "bg-emerald-500/10",
  maintenance: "bg-amber-500/10",
  nominal: "bg-emerald-500/10"
};

export default function KpiGrid({ kpis = [] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={idx} 
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-3.5 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 overflow-hidden"
          >
            {/* ICON CONTAINER: Smaller on mobile, large on desktop */}
            <div className={`flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${bgColors[kpi.status] || "bg-slate-500/10"}`}>
              {Icon && <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${statusColors[kpi.status] || "text-slate-500"}`} strokeWidth={2} />}
            </div>
            
            {/* TEXT CONTAINER: Shrinks and truncates gracefully */}
            <div className="min-w-0 w-full">
              <p className="text-[0.55rem] sm:text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                {kpi.label}
              </p>
              <p className="font-mono text-sm sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5 sm:mt-1 truncate">
                {kpi.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}