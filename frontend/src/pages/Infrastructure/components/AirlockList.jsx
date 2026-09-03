import { AlertTriangle, CheckCircle2 } from "lucide-react";

// Internalized status colors
const statusColors = {
  secure: "text-emerald-600 dark:text-emerald-500",
  maintenance: "text-amber-600 dark:text-amber-500",
  warn: "text-amber-600 dark:text-amber-500",
  danger: "text-red-600 dark:text-red-500"
};

export default function AirlockList({ airlocks = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 flex flex-col font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Airlock Integrity</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Perimeter</span>
      </div>
      <div className="flex-1 space-y-3">
        {airlocks.map((al) => (
          <div key={al.id} className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm transition-colors duration-300 hover:bg-white dark:hover:bg-slate-900">
            <div className="flex items-center gap-3">
              {al.status === "secure" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              <div>
                <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">{al.id}</p>
                <p className="text-[0.65rem] font-semibold uppercase text-slate-500 dark:text-slate-400 mt-0.5">Cycles: <span className="font-mono">{al.cycles ?? "N/A"}</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-[0.65rem] uppercase font-bold tracking-wider ${statusColors[al.status] || "text-slate-500"}`}>
                {al.status}
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 border-t border-slate-200 dark:border-slate-700/80 pt-1">
                Drop: <span className="font-mono">{al.pressureDrop ?? "0.00 psi"}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}