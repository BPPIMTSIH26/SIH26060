// Internalized color maps to make the component independent
const statusColors = {
  ok: "text-emerald-600 dark:text-emerald-500",
  warn: "text-amber-600 dark:text-amber-500",
  danger: "text-red-600 dark:text-red-500",
  nominal: "text-emerald-600 dark:text-emerald-500",
  fault: "text-red-600 dark:text-red-500",
  maintenance: "text-amber-600 dark:text-amber-500"
};

const bgColors = {
  ok: "bg-emerald-500/10",
  warn: "bg-amber-500/10",
  danger: "bg-red-500/10",
  nominal: "bg-emerald-500/10",
  fault: "bg-red-500/10",
  maintenance: "bg-amber-500/10"
};

// HELPER: Safely clamp floating point numbers
const formatTemp = (val) => {
  if (val === undefined || val === null || isNaN(val)) return "N/A";
  return Number(val).toFixed(1); // Force exactly 1 decimal place
};

export default function HvacTable({ systems = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 overflow-x-auto font-sans">
      <div className="mb-4 flex items-baseline justify-between min-w-[600px]">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">HVAC & Thermal Subsystems</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Live Telemetry</span>
      </div>
      
      <table className="w-full text-left text-sm min-w-[600px]">
        <thead className="border-b border-slate-200 dark:border-slate-700/80 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <tr>
            <th className="pb-3">Unit ID</th>
            <th className="pb-3">Zone</th>
            <th className="pb-3">Target (°C)</th>
            <th className="pb-3">Current (°C)</th>
            <th className="pb-3">Fan Speed (RPM)</th>
            <th className="pb-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {systems.map((sys) => (
            <tr key={sys.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
              <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">{sys.id}</td>
              <td className="py-3.5 font-medium text-slate-600 dark:text-slate-300">{sys.zone}</td>
              <td className="py-3.5 font-mono text-slate-500 dark:text-slate-400">
                {formatTemp(sys.target)}
              </td>
              <td className={`py-3.5 font-mono font-bold ${Math.abs((sys.current ?? 0) - (sys.target ?? 0)) > 3 ? "text-red-500" : "text-slate-900 dark:text-slate-100"}`}>
                {formatTemp(sys.current)}
              </td>
              <td className="py-3.5 font-mono text-slate-600 dark:text-slate-300 tabular-nums">{sys.rpm ?? "N/A"}</td>
              <td className="py-3.5 text-right">
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${bgColors[sys.status] || "bg-slate-500/10"} ${statusColors[sys.status] || "text-slate-500"}`}>
                  {sys.status || "unknown"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}