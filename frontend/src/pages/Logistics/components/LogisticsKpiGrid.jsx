
import { Activity, Package, Users, Droplet } from "lucide-react";

// Internalized color maps so it doesn't break
const statusColors = { ok: "text-emerald-500", warning: "text-amber-500", danger: "text-red-500" };
const bgColors = { ok: "bg-emerald-100 dark:bg-emerald-900/30", warning: "bg-amber-100 dark:bg-amber-900/30", danger: "bg-red-100 dark:bg-red-900/30" };

export default function LogisticsKpiGrid({ logisticsJson }) {
  if (!logisticsJson) return null;

  // Dynamically build the kpis array from the JSON payload
  const kpis = [
    { label: "System Health", value: `${logisticsJson.system_health_score}%`, status: logisticsJson.system_health_score > 80 ? "ok" : "danger", icon: Activity },
    { label: "Food Reserves", value: `${logisticsJson.supplies?.food?.current_stock_days} Days`, status: logisticsJson.supplies?.food?.status === "adequate" ? "ok" : "warning", icon: Package },
    { label: "Active Personnel", value: logisticsJson.personnel?.on_station_count, status: "ok", icon: Users },
    { label: "Fuel Status", value: logisticsJson.fuel_reserves?.reserve_status?.toUpperCase(), status: "ok", icon: Droplet },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div key={idx} className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/60 p-5 shadow-sm transition-colors duration-300">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${bgColors[kpi.status]}`}>
              <Icon className={`h-6 w-6 ${statusColors[kpi.status]}`} />
            </div>
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">
                {kpi.label}
              </p>
              <p className="font-mono text-xl font-bold text-gray-900 dark:text-slate-100 mt-0.5">
                {kpi.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}