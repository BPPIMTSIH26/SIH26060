
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function FuelDepletionChart({ logisticsJson }) {
  if (!logisticsJson) return null;

  // Build the time series dynamically ending on the current reserve from the JSON
  const currentReserve = logisticsJson.fuel_reserves?.reserve_status_percent || 100;
  
  const fuelBurnSeries = Array.from({ length: 13 }).map((_, i) => ({
    time: `-${(12 - i) * 6}h`,
    primary: Math.max(10, 80 - (i * 2)), 
    reserve: currentReserve
  }));

  return (
    <div className="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Fuel Depletion Curve</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Past 72 Hours · Primary vs Reserve</span>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={fuelBurnSeries} margin={{ left: -25, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillReserve" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', fontSize: '12px' }} className="dark:!bg-slate-950 dark:!border-slate-800 dark:!text-slate-100" />
            <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'CRITICAL THRESHOLD', fill: '#ef4444', fontSize: 9, fontFamily: 'monospace' }} />
            <Area type="monotone" dataKey="reserve" stackId="1" stroke="#f59e0b" fill="url(#fillReserve)" strokeWidth={2} name="Reserve Tank (%)" />
            <Area type="monotone" dataKey="primary" stackId="1" stroke="#0ea5e9" fill="url(#fillPrimary)" strokeWidth={2} name="Primary Tank (%)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}