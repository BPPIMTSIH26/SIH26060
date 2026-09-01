
import { Flame, Sun } from "lucide-react";

const statusColors = { ACTIVE: "text-emerald-600 dark:text-emerald-500", STANDBY: "text-amber-600 dark:text-amber-500", operational: "text-emerald-600 dark:text-emerald-500" };
const bgColors = { ACTIVE: "bg-emerald-500/10", STANDBY: "bg-amber-500/10", operational: "bg-emerald-500/10" };

export default function PowerSourcesTable({ sources = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 overflow-x-auto h-full">
      <div className="mb-4 flex items-baseline justify-between min-w-[600px]">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Active Power Sources</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Generator Telemetry</span>
      </div>
      
      <table className="w-full text-left font-mono text-sm min-w-[600px]">
        <thead className="border-b border-gray-200 dark:border-slate-700/80 text-[0.65rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">
          <tr>
            <th className="pb-3 font-medium">Source ID</th>
            <th className="pb-3 font-medium">Role</th>
            <th className="pb-3 font-medium">Live Output</th>
            <th className="pb-3 font-medium">Efficiency / Fuel</th>
            <th className="pb-3 font-medium">Maintenance / Runtime</th>
            <th className="pb-3 font-medium text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-slate-800/80">
          {sources.map((src) => (
            <tr key={src.id} className="transition-colors hover:bg-white/50 dark:hover:bg-slate-800/30">
              <td className="py-3 font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                {src.id.includes("GEN") ? <Flame className="w-4 h-4 text-amber-500"/> : <Sun className="w-4 h-4 text-yellow-400"/>}
                {src.id}
              </td>
              <td className="py-3 text-gray-600 dark:text-slate-300">{src.type}</td>
              <td className="py-3 font-bold text-gray-900 dark:text-slate-100 tabular-nums">
                {src.output} kW
                {src.maxOutput && <span className="block text-[0.6rem] text-gray-500 font-normal">Max: {src.maxOutput} kW</span>}
              </td>
              <td className="py-3 text-gray-600 dark:text-slate-300">{src.efficiency}</td>
              <td className="py-3 text-gray-600 dark:text-slate-300">
                {src.runtime ? (
                  <>
                    <div className="text-xs">{src.runtime}h Total</div>
                    <div className="text-[0.65rem] text-amber-600 dark:text-amber-500">Due in {src.maintDue}h</div>
                  </>
                ) : <span className="text-xs">N/A</span>}
              </td>
              <td className="py-3 text-right">
                <span className={`inline-flex items-center rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${bgColors[src.status] || "bg-gray-500/10"} ${statusColors[src.status] || "text-gray-500"}`}>
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