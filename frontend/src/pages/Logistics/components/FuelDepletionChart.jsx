import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function FuelDepletionChart({ logisticsJson }) {
  if (!logisticsJson) return null;

  const currentReserve = logisticsJson.fuel_reserves?.reserve_status_percent || 100;
  
  const fuelBurnSeries = Array.from({ length: 13 }).map((_, i) => ({
    time: `-${(12 - i) * 6}h`,
    primary: Math.max(10, 80 - (i * 2)), 
    reserve: currentReserve
  }));

  return (
    <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 font-sans flex flex-col">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Fuel Depletion Curve</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Past 72 Hours · Primary vs Reserve</span>
      </div>
      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={fuelBurnSeries} margin={{ left: -25, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fillReserve" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800/80" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "inherit" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "inherit" }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} className="dark:!bg-slate-900 dark:!border-slate-800 dark:!text-slate-100" />
            <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'CRITICAL THRESHOLD', fill: '#ef4444', fontSize: 9, fontFamily: 'monospace' }} />
            <Area type="monotone" dataKey="reserve" stackId="1" stroke="#f59e0b" fill="url(#fillReserve)" strokeWidth={2.5} name="Reserve Tank (%)" />
            <Area type="monotone" dataKey="primary" stackId="1" stroke="#0ea5e9" fill="url(#fillPrimary)" strokeWidth={2.5} name="Primary Tank (%)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}