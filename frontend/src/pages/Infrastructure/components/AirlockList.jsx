import { AlertTriangle, CheckCircle2 } from "lucide-react";

// Internalized status colors so it doesn't rely on external files
const statusColors = {
  secure: "text-emerald-600 dark:text-emerald-500",
  maintenance: "text-amber-600 dark:text-amber-500",
  warn: "text-amber-600 dark:text-amber-500",
  danger: "text-red-600 dark:text-red-500"
};

export default function AirlockList({ airlocks = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 flex flex-col">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Airlock Integrity</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Perimeter</span>
      </div>
      <div className="flex-1 space-y-3">
        {airlocks.map((al) => (
          <div key={al.id} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-3 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-3">
              {al.status === "secure" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              <div>
                <p className="font-mono text-sm font-bold text-gray-900 dark:text-slate-100">{al.id}</p>
                <p className="font-mono text-[0.65rem] uppercase text-gray-500 dark:text-slate-400">Cycles: {al.cycles ?? "N/A"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-mono text-[0.65rem] uppercase font-bold tracking-wider ${statusColors[al.status] || "text-gray-500"}`}>
                {al.status}
              </p>
              <p className="font-mono text-xs text-gray-500 dark:text-slate-400 mt-0.5 border-t border-gray-200 dark:border-slate-700 pt-0.5">
                Drop: {al.pressureDrop ?? "0.00 psi"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}