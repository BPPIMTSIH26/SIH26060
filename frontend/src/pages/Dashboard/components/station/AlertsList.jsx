// Internalized mapping
const statusColor = {
  ok: "#10b981",
  warn: "#f59e0b",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6"
};

export default function AlertsList({ alerts = [] }) {
  const openCount = alerts.length;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 flex flex-col h-[280px] relative overflow-hidden transition-colors font-sans">
      <div className="mb-3 flex items-center justify-between relative z-10">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Active Alerts</h3>
        <span className={`rounded-md px-2 py-0.5 text-xs font-bold tabular-nums border shadow-sm ${openCount > 0 ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'}`}>
          {openCount} OPEN
        </span>
      </div>
      
      <ul className="flex-1 space-y-2.5 overflow-y-auto pr-1 relative z-10 custom-scrollbar">
        {alerts.map((a, i) => {
          const severity = a.severity?.toLowerCase() || "info";
          const clr = statusColor[severity] || statusColor.info;
          const source = a.module || a.source || "SYSTEM";

          return (
            <li key={i} className="group flex items-start gap-3 rounded-xl border border-slate-200/70 dark:border-slate-800/60 bg-slate-50/80 dark:bg-slate-900/50 px-3.5 py-2.5 shadow-sm transition-all hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700">
              <span
                className="mt-0.5 rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider shrink-0"
                style={{ backgroundColor: `${clr}15`, color: clr, border: `1px solid ${clr}40` }}
              >
                {source}
              </span>
              <p className="min-w-0 flex-1 text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                {a.message}
              </p>
            </li>
          );
        })}
        {alerts.length === 0 && (
          <li className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 py-8">No active alerts. All systems nominal.</li>
        )}
      </ul>
    </div>
  );
}