import { Area, AreaChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from "recharts";

export function TrendCharts({ powerSeries = [], tempSeries = [], fuelSeries = [] }) {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 font-sans">
      
      {/* 1. POWER CHART */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Power Matrix</h3>
          <span className="font-mono text-[0.65rem] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Gen vs Load · 24h</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={powerSeries} margin={{ left: -25, right: 0, top: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="fillLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-900" vertical={false} />
              <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "inherit" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "inherit" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} className="dark:!bg-slate-900 dark:!border-slate-800 dark:!text-slate-100" />
              <Area dataKey="generation" name="Generation (kW)" type="monotone" stroke="#0ea5e9" fill="none" strokeWidth={2.5} />
              <Area dataKey="load" name="Load (kW)" type="monotone" stroke="#ef4444" fill="url(#fillLoad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. TEMPERATURE CHART */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Thermal Zones</h3>
          <span className="font-mono text-[0.65rem] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">3 Modules · 7d</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tempSeries} margin={{ left: -25, right: 0, top: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-900" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "inherit" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "inherit" }} tickLine={false} axisLine={false} />
              <ReferenceArea y1={18} y2={22} fill="#10b981" fillOpacity={0.08} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} className="dark:!bg-slate-900 dark:!border-slate-800 dark:!text-slate-100" />
              <Line dataKey="quarters" name="Quarters (°C)" type="monotone" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
              <Line dataKey="lab" name="Lab (°C)" type="monotone" stroke="#10b981" strokeWidth={2.5} dot={false} />
              <Line dataKey="storage" name="Storage (°C)" type="monotone" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. FUEL CHART */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Fuel Reserves</h3>
          <span className="font-mono text-[0.65rem] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Pri vs Res · 72h</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fuelSeries} margin={{ left: -25, right: 0, top: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="fillPri" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillRes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-900" vertical={false} />
              <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "inherit" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "inherit" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} className="dark:!bg-slate-900 dark:!border-slate-800 dark:!text-slate-100" />
              <Area dataKey="reserve" name="Reserve (kL)" stackId="1" type="monotone" stroke="#f59e0b" fill="url(#fillRes)" strokeWidth={2.5} />
              <Area dataKey="primary" name="Primary (kL)" stackId="1" type="monotone" stroke="#0ea5e9" fill="url(#fillPri)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </section>
  );
}