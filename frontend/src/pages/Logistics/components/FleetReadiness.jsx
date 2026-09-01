
import { Truck } from "lucide-react";

const statusColors = { ok: "text-emerald-500", warning: "text-amber-500", danger: "text-red-500" };

export default function FleetReadiness({ logisticsJson }) {
  if (!logisticsJson) return null;

  // Map the incoming shipments to match your exact Fleet UI format
  const fleet = (logisticsJson.shipments?.incoming || []).map((ship) => ({
    id: ship.shipment_id.split('-').slice(1).join('-'), 
    type: `${ship.priority} Transport`,
    status: ship.shipment_status === "in_transit" ? "warning" : "ok",
    health: Math.max(10, 100 - (ship.eta_days * 2)) // Translates ETA into a progress bar format
  }));

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 flex flex-col">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Fleet Readiness</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Surface Vehicles</span>
      </div>
      <div className="flex-1 space-y-3">
        {fleet.map((vehicle) => (
          <div key={vehicle.id} className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50 p-3 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className={`h-4 w-4 ${statusColors[vehicle.status]}`} />
                <div>
                  <p className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">{vehicle.id}</p>
                  <p className="font-mono text-[0.6rem] uppercase text-gray-500 dark:text-slate-400">{vehicle.type}</p>
                </div>
              </div>
              <span className={`font-mono text-xs font-bold uppercase ${statusColors[vehicle.status]}`}>
                {vehicle.status === "ok" ? "Deployable" : vehicle.status}
              </span>
            </div>
            {/* Health Bar */}
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[0.65rem] text-gray-500 dark:text-slate-400 w-8">HLTH</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${vehicle.health > 70 ? 'bg-emerald-500' : vehicle.health > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${vehicle.health}%` }}
                />
              </div>
              <span className="font-mono text-[0.65rem] font-bold text-gray-900 dark:text-slate-100 w-8 text-right">{vehicle.health}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}