import { Activity } from "lucide-react";

const statusColors = { ok: "text-emerald-600 dark:text-emerald-500", warn: "text-amber-600 dark:text-amber-500", danger: "text-red-600 dark:text-red-500" };
const bgColors = { ok: "bg-emerald-500/10", warn: "bg-amber-500/10", danger: "bg-red-500/10" };

export default function SensorTable({ sensors = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 overflow-x-auto h-full font-sans">
      <div className="mb-4 flex items-baseline justify-between min-w-[600px]">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">External Sensor Array</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Live Instruments</span>
      </div>
      
      <table className="w-full text-left text-sm min-w-[600px]">
        <thead className="border-b border-slate-200 dark:border-slate-700/80 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <tr>
            <th className="pb-3">Instrument ID</th>
            <th className="pb-3">Type</th>
            <th className="pb-3">Location</th>
            <th className="pb-3">Live Reading</th>
            <th className="pb-3 text-right">Health</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {sensors.map((sensor) => (
            <tr key={sensor.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
              <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-500" />
                {sensor.id}
              </td>
              <td className="py-3.5 font-medium text-slate-600 dark:text-slate-300">{sensor.type}</td>
              <td className="py-3.5 text-slate-600 dark:text-slate-300">{sensor.location}</td>
              <td className={`py-3.5 font-mono font-bold ${sensor.status === 'danger' ? 'text-red-500' : 'text-slate-900 dark:text-slate-100'}`}>
                {sensor.reading}
              </td>
              <td className="py-3.5 text-right">
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${bgColors[sensor.status]} ${statusColors[sensor.status]}`}>
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