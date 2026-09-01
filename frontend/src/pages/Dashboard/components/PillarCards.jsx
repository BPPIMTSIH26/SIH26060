import React from "react";
import { Link } from "react-router-dom";
import { Maximize2 } from "lucide-react";

const statusColor = {
  ok: "#10b981", 
  warn: "#f59e0b", 
  danger: "#ef4444", 
};

const statusLabel = {
  ok: "Nominal",
  warn: "Degraded",
  danger: "Critical",
};

export function PillarCards({ pillars = [] }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans">
      {pillars.map((pillar) => {
        const clr = statusColor[pillar.status] || statusColor.ok;
        const Icon = pillar.icon;

        return (
          <Link
            key={pillar.id}
            to={pillar.link}
            className="
              group rounded-2xl border p-4.5
              border-slate-200/80 bg-white/70 backdrop-blur-md
              shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] block
              transition-all duration-200
              hover:border-cyan-500/50 hover:shadow-[0_8px_30px_-4px_rgba(6,182,212,0.15)]
              dark:border-slate-800/80 dark:bg-slate-950/60
              dark:shadow-none
              dark:hover:border-cyan-500/40
            "
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  {pillar.status === "danger" && (
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                      style={{ backgroundColor: clr }}
                    />
                  )}
                  <span
                    className="relative h-2.5 w-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: clr }}
                  />
                </span>

                {Icon && (
                  <Icon
                    className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
                    strokeWidth={2}
                  />
                )}

                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {pillar.title}
                </h3>
              </div>

              {/* Expand button visual cue */}
              <div className="rounded-lg border border-transparent p-1 text-slate-400 opacity-0 transition-all group-hover:text-cyan-600 group-hover:opacity-100 dark:text-slate-500 dark:group-hover:text-cyan-400">
                <Maximize2 className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Status */}
            <div
              className="mb-3.5 font-mono text-[0.65rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md inline-block bg-slate-100 dark:bg-slate-900"
              style={{ color: clr }}
            >
              {statusLabel[pillar.status] || "Unknown"}
            </div>

            {/* Metrics */}
            <dl className="grid grid-cols-2 gap-x-3 gap-y-3 pt-1 border-t border-slate-100 dark:border-slate-900">
              {pillar.metrics.map((m) => {
                const MIcon = m.icon;
                return (
                  <div key={m.label} className="flex items-center gap-2.5">
                    {MIcon && <MIcon className="h-3.5 w-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />}
                    <div className="min-w-0">
                      <dt className="truncate text-[0.65rem] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {m.label}
                      </dt>
                      <dd className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {m.value}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </Link>
        );
      })}
    </section>
  );
}