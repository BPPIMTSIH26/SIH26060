import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Line } from "recharts";

export default function PressureChart({ seriesData = [] }) {
  return (
    <div className="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">External Load Pressure</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Past 24 Hours · kPa</span>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={seriesData} margin={{ left: -25, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillPressure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0.5, 2.0]} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', fontSize: '12px' }} className="dark:!bg-slate-950 dark:!border-slate-800 dark:!text-slate-100" />
            <Line type="monotone" dataKey="limit" stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1} dot={false} name="Safety Limit" />
            <Area type="monotone" dataKey="pressure" stroke="#0ea5e9" fill="url(#fillPressure)" strokeWidth={2} name="Load (kPa)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}