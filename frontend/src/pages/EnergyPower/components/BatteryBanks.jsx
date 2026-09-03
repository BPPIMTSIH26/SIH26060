import { Battery, BatteryWarning } from "lucide-react";

const statusColors = { ok: "text-emerald-500", warn: "text-amber-500", danger: "text-red-500" };

export default function BatteryBanks({ batteries = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 flex flex-col h-full font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Storage Arrays</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cell Health</span>
      </div>
      <div className="flex-1 space-y-4">
        {batteries.map((bat) => (
          <div key={bat.id} className="flex flex-col gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {bat.status === "ok" ? <Battery className="h-4 w-4 text-emerald-500 shrink-0" /> : <BatteryWarning className={`h-4 w-4 shrink-0 ${statusColors[bat.status]}`} />}
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">{bat.id}</span>
              </div>
              <span className={`font-mono text-sm font-bold tabular-nums ${statusColors[bat.status]}`}>{bat.charge}%</span>
            </div>
            
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800/80">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${bat.status === 'ok' ? 'bg-emerald-500' : bat.status === 'warn' ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${bat.charge}%` }}
              />
            </div>
            
            <div className="flex justify-between font-mono text-[0.65rem] uppercase text-slate-500 dark:text-slate-400">
              <span>{bat.infoLeft}</span>
              <span>{bat.infoRight}</span>
            </div>
            <div className="flex justify-between font-mono text-[0.6rem] uppercase text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-700/80 pt-1.5 mt-0.5">
              <span>{bat.kwhText}</span>
              <span>Eff: {bat.efficiency}% | {bat.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}