import { Truck } from "lucide-react";

const statusColors = { ok: "text-emerald-500", warning: "text-amber-500", danger: "text-red-500" };

export default function FleetReadiness({ logisticsJson }) {
  if (!logisticsJson) return null;

  const fleet = (logisticsJson.shipments?.incoming || []).map((ship) => ({
    id: ship.shipment_id.split('-').slice(1).join('-'), 
    type: `${ship.priority} Transport`,
    status: ship.shipment_status === "in_transit" ? "warning" : "ok",
    health: Math.max(10, 100 - (ship.eta_days * 2))
  }));

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 flex flex-col h-full font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Fleet Readiness</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Surface Vehicles</span>
      </div>
      <div className="flex-1 space-y-3">
        {fleet.map((vehicle) => (
          <div key={vehicle.id} className="flex flex-col gap-2 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm transition-colors duration-300 hover:bg-white dark:hover:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className={`h-4 w-4 shrink-0 ${statusColors[vehicle.status]}`} />
                <div>
                  <p className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{vehicle.id}</p>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">{vehicle.type}</p>
                </div>
              </div>
              <span className={`text-[0.65rem] font-bold uppercase tracking-wider ${statusColors[vehicle.status]}`}>
                {vehicle.status === "ok" ? "Deployable" : vehicle.status}
              </span>
            </div>
            {/* Health Bar */}
            <div className="flex items-center gap-2.5 mt-1 border-t border-slate-200 dark:border-slate-700/80 pt-2">
              <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-8">HLTH</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${vehicle.health > 70 ? 'bg-emerald-500' : vehicle.health > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${vehicle.health}%` }}
                />
              </div>
              <span className="font-mono text-[0.65rem] font-bold text-slate-900 dark:text-slate-100 w-8 text-right">{vehicle.health}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}