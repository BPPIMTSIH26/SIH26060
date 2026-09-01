import React from "react";

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
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/60 p-5 shadow-lg flex flex-col h-[280px] relative overflow-hidden transition-colors duration-300">
      <div className="mb-4 flex items-center justify-between relative z-10">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-500 dark:text-slate-400">Active Alerts</h3>
        <span className={`rounded px-2 py-0.5 font-mono text-[0.65rem] font-bold tabular-nums border shadow-sm ${openCount > 0 ? 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20'}`}>
          {openCount} OPEN
        </span>
      </div>
      
      <ul className="flex-1 space-y-2.5 overflow-y-auto pr-1 relative z-10 custom-scrollbar">
        {alerts.map((a, i) => {
          const severity = a.severity?.toLowerCase() || "info";
          const clr = statusColor[severity] || statusColor.info;
          const source = a.module || a.source || "SYSTEM";

          return (
            <li key={i} className="group flex items-start gap-3 rounded-lg border border-gray-200 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/50 px-3 py-2.5 shadow-sm transition-all hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:border-gray-300 dark:hover:border-slate-600">
              <span
                className="mt-0.5 rounded px-1.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider shrink-0"
                style={{ backgroundColor: `${clr}15`, color: clr, border: `1px solid ${clr}40` }}
              >
                {source}
              </span>
              <p className="min-w-0 flex-1 font-mono text-[0.7rem] leading-relaxed text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white">
                {a.message}
              </p>
            </li>
          );
        })}
        {alerts.length === 0 && (
          <li className="text-center font-mono text-sm text-gray-400 dark:text-slate-500 py-4">No active alerts.</li>
        )}
      </ul>
    </div>
  );
}