import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function TemperatureChart({ temperatureSeries = [] }) {
  return (
    <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Thermal Insulation Delta</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Internal vs External (°C)</span>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={temperatureSeries} margin={{ left: -25, right: 0, top: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800/80" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "inherit" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "inherit" }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} className="dark:!bg-slate-900 dark:!border-slate-800 dark:!text-slate-100" />
            
            <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" opacity={0.5} />
            
            <Line type="monotone" dataKey="int" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Internal Avg (°C)" />
            <Line type="monotone" dataKey="ext" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} name="External (°C)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}