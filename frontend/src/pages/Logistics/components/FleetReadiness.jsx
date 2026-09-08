import { Truck } from "lucide-react";

const statusColors = {
  ok: "text-emerald-500",
  warning: "text-amber-500",
  danger: "text-red-500",
};

export default function FleetReadiness({ logisticsJson }) {
  if (!logisticsJson) return null;

  /*
   * Backend response:
   *
   * {
   *   shipments: [...],
   *   data: {
   *     shipments: {
   *       incoming: [...]
   *     }
   *   }
   * }
   *
   * Prefer the dashboard incoming list when available.
   */
  const incomingShipments =
    logisticsJson?.shipments?.incoming ||
    logisticsJson?.data?.shipments?.incoming ||
    [];

  const fleet = incomingShipments.map((shipment) => {
    const status = shipment?.shipment_status ||
      shipment?.status?.toLowerCase() ||
      "preparing";

    let uiStatus = "ok";

    if (
      status === "in_transit" ||
      status === "in-transit" ||
      status === "in_transit"
    ) {
      uiStatus = "warning";
    }

    if (
      status === "cancelled"
    ) {
      uiStatus = "danger";
    }

    /*
     * Backend does not contain vehicle health.
     * Therefore we should not invent a health value from ETA.
     *
     * Use shipment status to provide a simple operational
     * readiness indicator instead.
     */
    const health =
      uiStatus === "ok"
        ? 100
        : uiStatus === "warning"
        ? 70
        : 30;

    return {
      id:
        shipment?.shipment_id ||
        shipment?.shipmentNumber ||
        "UNKNOWN",

      type:
        shipment?.priority
          ? `${shipment.priority} Transport`
          : shipment?.contents
            ? shipment.contents
            : shipment?.criticality || "Supply Transport",

      status: uiStatus,

      health,
    };
  });

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 flex flex-col h-full font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Fleet Readiness
        </h3>

        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Surface Vehicles
        </span>
      </div>

      <div className="flex-1 space-y-3">
        {fleet.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              No active incoming shipments.
            </p>
          </div>
        ) : (
          fleet.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm transition-colors duration-300 hover:bg-white dark:hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck
                    className={`h-4 w-4 shrink-0 ${
                      statusColors[vehicle.status]
                    }`}
                  />

                  <div>
                    <p className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                      {vehicle.id}
                    </p>

                    <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                      {vehicle.type}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[0.65rem] font-bold uppercase tracking-wider ${
                    statusColors[vehicle.status]
                  }`}
                >
                  {vehicle.status === "ok"
                    ? "Deployable"
                    : vehicle.status === "warning"
                    ? "In Transit"
                    : "Unavailable"}
                </span>
              </div>

              {/* Readiness Bar */}
              <div className="flex items-center gap-2.5 mt-1 border-t border-slate-200 dark:border-slate-700/80 pt-2">
                <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-8">
                  RDY
                </span>

                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      vehicle.health > 70
                        ? "bg-emerald-500"
                        : vehicle.health > 40
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${vehicle.health}%`,
                    }}
                  />
                </div>

                <span className="font-mono text-[0.65rem] font-bold text-slate-900 dark:text-slate-100 w-8 text-right">
                  {vehicle.health}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}