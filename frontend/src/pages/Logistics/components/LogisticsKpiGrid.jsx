import { Activity, Package, Users, Droplet } from "lucide-react";

// Helper to safely format numbers to 1 decimal place
const formatMetric = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return Number(val).toFixed(decimals);
};

const statusColors = { ok: "text-emerald-600 dark:text-emerald-500", warning: "text-amber-600 dark:text-amber-500", danger: "text-red-600 dark:text-red-500" };
const bgColors = { ok: "bg-emerald-500/10", warning: "bg-amber-500/10", danger: "bg-red-500/10" };

export default function LogisticsKpiGrid({ logisticsJson }) {
  if (!logisticsJson) return null;

  const kpis = [
    { label: "System Health", value: `${formatMetric(logisticsJson.system_health_score, 1)}%`, status: logisticsJson.system_health_score > 80 ? "ok" : "danger", icon: Activity },
    { label: "Food Reserves", value: `${formatMetric(logisticsJson.supplies?.food?.current_stock_days, 1)} Days`, status: logisticsJson.supplies?.food?.status === "adequate" ? "ok" : "warning", icon: Package },
    { label: "Active Personnel", value: Math.round(logisticsJson.personnel?.on_station_count || 0), status: "ok", icon: Users },
    { label: "Fuel Status", value: logisticsJson.fuel_reserves?.reserve_status?.toUpperCase() || "UNKNOWN", status: "ok", icon: Droplet },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={idx} 
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-3.5 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 overflow-hidden"
          >
            {/* ICON CONTAINER */}
            <div className={`flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${bgColors[kpi.status] || "bg-slate-500/10"}`}>
              {Icon && <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${statusColors[kpi.status] || "text-slate-500"}`} strokeWidth={2} />}
            </div>
            
            {/* TEXT CONTAINER */}
            <div className="min-w-0 w-full">
              <p className="text-[0.55rem] sm:text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                {kpi.label}
              </p>
              <p className="font-mono text-sm sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5 sm:mt-1 truncate">
                {kpi.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}