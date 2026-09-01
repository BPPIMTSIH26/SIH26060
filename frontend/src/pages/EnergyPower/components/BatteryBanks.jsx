
import { Battery, BatteryWarning } from "lucide-react";

const statusColors = { ok: "text-emerald-500", warn: "text-amber-500", danger: "text-red-500" };

export default function BatteryBanks({ batteries = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 flex flex-col h-full">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Storage Arrays</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Cell Health</span>
      </div>
      <div className="flex-1 space-y-4">
        {batteries.map((bat) => (
          <div key={bat.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {bat.status === "ok" ? <Battery className="h-4 w-4 text-emerald-500" /> : <BatteryWarning className={`h-4 w-4 ${statusColors[bat.status]}`} />}
                <span className="font-mono text-sm font-bold text-gray-900 dark:text-slate-100">{bat.id}</span>
              </div>
              <span className={`font-mono text-sm font-bold tabular-nums ${statusColors[bat.status]}`}>{bat.charge}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${bat.status === 'ok' ? 'bg-emerald-500' : bat.status === 'warn' ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${bat.charge}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[0.65rem] uppercase text-gray-500 dark:text-slate-400">
              <span>{bat.infoLeft}</span>
              <span>{bat.infoRight}</span>
            </div>
            {/* NEW: Deep Data Row */}
            <div className="flex justify-between font-mono text-[0.6rem] uppercase text-gray-400 dark:text-slate-500 mt-1">
              <span>{bat.kwhText}</span>
              <span>Eff: {bat.efficiency}% | {bat.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}