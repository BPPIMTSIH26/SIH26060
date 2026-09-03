import { Flame, Sun } from "lucide-react";

const statusColors = { ACTIVE: "text-emerald-600 dark:text-emerald-500", STANDBY: "text-amber-600 dark:text-amber-500", operational: "text-emerald-600 dark:text-emerald-500" };
const bgColors = { ACTIVE: "bg-emerald-500/10", STANDBY: "bg-amber-500/10", operational: "bg-emerald-500/10" };

export default function PowerSourcesTable({ sources = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 overflow-x-auto h-full font-sans">
      <div className="mb-4 flex items-baseline justify-between min-w-[600px]">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Active Power Sources</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Generator Telemetry</span>
      </div>
      
      <table className="w-full text-left text-sm min-w-[600px]">
        <thead className="border-b border-slate-200 dark:border-slate-700/80 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <tr>
            <th className="pb-3">Source ID</th>
            <th className="pb-3">Role</th>
            <th className="pb-3">Live Output</th>
            <th className="pb-3">Efficiency / Fuel</th>
            <th className="pb-3">Maintenance / Runtime</th>
            <th className="pb-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {sources.map((src) => (
            <tr key={src.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
              <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {src.id.includes("GEN") ? <Flame className="w-4 h-4 text-amber-500"/> : <Sun className="w-4 h-4 text-amber-400"/>}
                {src.id}
              </td>
              <td className="py-3.5 font-medium text-slate-600 dark:text-slate-300">{src.type}</td>
              <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {src.output} kW
                {src.maxOutput && <span className="block text-[0.6rem] font-medium text-slate-500 font-sans mt-0.5">Max: {src.maxOutput} kW</span>}
              </td>
              <td className="py-3.5 font-mono text-slate-600 dark:text-slate-300">{src.efficiency}</td>
              <td className="py-3.5 text-slate-600 dark:text-slate-300">
                {src.runtime ? (
                  <>
                    <div className="font-mono text-xs">{src.runtime}h Total</div>
                    <div className="font-semibold text-[0.65rem] text-amber-600 dark:text-amber-500 mt-0.5">Due in {src.maintDue}h</div>
                  </>
                ) : <span className="text-xs">N/A</span>}
              </td>
              <td className="py-3.5 text-right">
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${bgColors[src.status] || "bg-slate-500/10"} ${statusColors[src.status] || "text-slate-500"}`}>
                  {src.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}