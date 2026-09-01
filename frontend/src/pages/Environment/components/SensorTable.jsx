
import { Activity } from "lucide-react";

const statusColors = { ok: "text-emerald-600 dark:text-emerald-500", warn: "text-amber-600 dark:text-amber-500", danger: "text-red-600 dark:text-red-500" };
const bgColors = { ok: "bg-emerald-500/10", warn: "bg-amber-500/10", danger: "bg-red-500/10" };

export default function SensorTable({ sensors = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 overflow-x-auto h-full">
      <div className="mb-4 flex items-baseline justify-between min-w-[600px]">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">External Sensor Array</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Live Instruments</span>
      </div>
      
      <table className="w-full text-left font-mono text-sm min-w-[600px]">
        <thead className="border-b border-gray-200 dark:border-slate-700/80 text-[0.65rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">
          <tr>
            <th className="pb-3 font-medium">Instrument ID</th>
            <th className="pb-3 font-medium">Type</th>
            <th className="pb-3 font-medium">Location</th>
            <th className="pb-3 font-medium">Live Reading</th>
            <th className="pb-3 font-medium text-right">Health</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-slate-800/80">
          {sensors.map((sensor) => (
            <tr key={sensor.id} className="transition-colors hover:bg-white/50 dark:hover:bg-slate-800/30">
              <td className="py-3 font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-500" />
                {sensor.id}
              </td>
              <td className="py-3 text-gray-600 dark:text-slate-300">{sensor.type}</td>
              <td className="py-3 text-gray-600 dark:text-slate-300">{sensor.location}</td>
              <td className={`py-3 font-bold ${sensor.status === 'danger' ? 'text-red-500' : 'text-gray-900 dark:text-slate-100'}`}>
                {sensor.reading}
              </td>
              <td className="py-3 text-right">
                <span className={`inline-flex items-center rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${bgColors[sensor.status]} ${statusColors[sensor.status]}`}>
                  {sensor.status === "ok" ? "Online" : sensor.status === "warn" ? "Degraded" : "Fault"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}