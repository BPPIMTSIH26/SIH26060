import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Line } from "recharts";

export default function PressureChart({ seriesData = [] }) {
  return (
    <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 font-sans flex flex-col">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">External Load Pressure</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Past 24 Hours · kPa</span>
      </div>
      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={seriesData} margin={{ left: -25, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillPressure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800/80" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "inherit" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "inherit" }} tickLine={false} axisLine={false} domain={[0.5, 2.0]} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} className="dark:!bg-slate-900 dark:!border-slate-800 dark:!text-slate-100" />
            <Line type="monotone" dataKey="limit" stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="Safety Limit" />
            <Area type="monotone" dataKey="pressure" stroke="#0ea5e9" fill="url(#fillPressure)" strokeWidth={2.5} name="Load (kPa)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}