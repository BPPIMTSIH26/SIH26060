import React from "react";

// Internalized mapping
const statusColor = {
  ok: "#10b981",
  warn: "#f59e0b",
  warning: "#f59e0b",
  danger: "#ef4444"
};

export default function HealthGauge({ health = {} }) {
  const {
    value = 100,
    trend = "stable",
    delta = "0",
    breakdown = [],
  } = health;

  const gaugeColor =
    value > 75
      ? statusColor.ok
      : value >= 50
        ? statusColor.warn
        : statusColor.danger;

  const r = 52;
  const circumference = 2 * Math.PI * r;
  const dash = (value / 100) * circumference;

  return (
    <div className="relative h-[230px] overflow-hidden rounded-xl border p-5 border-slate-200 bg-amber-100 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-lg flex flex-col justify-between">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-[0.07] blur-3xl dark:opacity-10"
        style={{ backgroundColor: gaugeColor }}
      />

      <h3 className="relative z-10 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
        Station Health Index
      </h3>

      <div className="relative z-10 flex items-center gap-6 mt-2">
        <div className="relative h-32 w-32 shrink-0 drop-shadow-lg dark:drop-shadow-2xl">
          <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
            <circle cx="64" cy="64" r={r} fill="none" className="stroke-slate-200 dark:stroke-slate-950" strokeWidth="10" />
            <circle
              cx="64" cy="64" r={r} fill="none" stroke={gaugeColor} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`} className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-4xl font-black tabular-nums tracking-tighter" style={{ color: gaugeColor }}>
              {value}
            </span>
            <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {trend === "improving" ? "▲" : trend === "deteriorating" ? "▼" : "■"} {trend}
            </span>
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="flex-1 space-y-3">
          {breakdown.length > 0 ? breakdown.map((b) => (
            <div key={b.label}>
              <div className="mb-1.5 flex items-center justify-between font-mono text-[0.65rem] font-bold uppercase tracking-wider">
                <span className="text-slate-500 dark:text-slate-400">{b.label}</span>
                <span className="tabular-nums font-bold" style={{ color: statusColor[b.status] || statusColor.ok }}>{b.value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                <div className="relative h-full rounded-full transition-all duration-1000"
                  style={{ width: `${b.value}%`, backgroundColor: statusColor[b.status] || statusColor.ok }}
                />
              </div>
            </div>
          )) : (
             <div className="text-xs font-mono text-gray-500 dark:text-slate-500 text-center w-full mt-4">
                 All Systems Normal
             </div>
          )}
        </div>
      </div>
    </div>
  );
}