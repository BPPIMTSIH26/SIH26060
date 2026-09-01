import React from "react";
import { Link } from "react-router-dom";
import { Maximize2 } from "lucide-react";

// Internalized maps so it doesn't 404 looking for mock-data.js
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
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {pillars.map((pillar) => {
        const clr = statusColor[pillar.status] || statusColor.ok;
        const Icon = pillar.icon;

        return (
          <Link
            key={pillar.id}
            to={pillar.link}
            className="
              group rounded-xl border p-4
              border-slate-200 bg-amber-100/50
              shadow-sm block
              transition-all duration-200
              hover:border-cyan-400/60 hover:shadow-md

              dark:border-slate-800
              dark:bg-slate-900/60
              dark:shadow-none
              dark:hover:border-cyan-500/50
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
                    className="relative h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: clr }}
                  />
                </span>

                {Icon && (
                  <Icon
                    className="h-4 w-4 text-slate-500 dark:text-slate-400"
                    strokeWidth={1.75}
                  />
                )}

                <h3 className="font-mono text-sm font-medium tracking-wide text-slate-800 dark:text-slate-100">
                  {pillar.title}
                </h3>
              </div>

              {/* Expand button (acts as the link visual cue) */}
              <div className="rounded border border-transparent p-1 text-slate-400 opacity-0 transition-all group-hover:text-cyan-500 group-hover:opacity-100 dark:text-slate-500 dark:group-hover:text-cyan-400">
                <Maximize2 className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Status */}
            <div
              className="mb-4 font-mono text-[0.6rem] uppercase tracking-widest"
              style={{ color: clr }}
            >
              {statusLabel[pillar.status] || "Unknown"}
            </div>

            {/* Metrics */}
            <dl className="grid grid-cols-2 gap-x-3 gap-y-3">
              {pillar.metrics.map((m) => {
                const MIcon = m.icon;
                return (
                  <div key={m.label} className="flex items-center gap-2">
                    {MIcon && <MIcon className="h-3.5 w-3.5 shrink-0 text-cyan-600/80 dark:text-cyan-500/70" />}
                    <div className="min-w-0">
                      <dt className="truncate font-mono text-[0.6rem] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {m.label}
                      </dt>
                      <dd className="font-mono text-sm text-slate-800 dark:text-slate-100">
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