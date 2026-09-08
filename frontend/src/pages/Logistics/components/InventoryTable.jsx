import {
  Package,
  Wrench,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

const statusColors = {
  ok: "text-emerald-600 dark:text-emerald-500",
  warning: "text-amber-600 dark:text-amber-500",
  danger: "text-red-600 dark:text-red-500",
};

const bgColors = {
  ok: "bg-emerald-500/10",
  warning: "bg-amber-500/10",
  danger: "bg-red-500/10",
};

export default function InventoryTable({ logisticsJson }) {
  if (!logisticsJson) return null;

  /*
   * Backend response:
   *
   * {
   *   message,
   *   count,
   *   shipments,
   *   data: {
   *     supplies: {
   *       food,
   *       medical,
   *       spare_parts
   *     },
   *     fuel_reserves: {...}
   *   }
   * }
   */

  const data = logisticsJson?.data || logisticsJson;

  const supplies = data?.supplies || {};
  const fuelReserves = data?.fuel_reserves || {};

  const food = supplies?.food || {};
  const medical = supplies?.medical || {};
  const spareParts = supplies?.spare_parts || {};

  /*
   * Determine status from backend values.
   */
  const foodStatus =
    food?.status === "critical"
      ? "danger"
      : food?.status === "low"
        ? "warning"
        : "ok";

  const medicalStatus =
    (medical?.current_stock_percent ?? 100) <=
    (medical?.thresholds?.critical_low_percent ?? 20)
      ? "danger"
      : (medical?.current_stock_percent ?? 100) <=
        (medical?.thresholds?.warning_low_percent ?? 40)
        ? "warning"
        : "ok";

  const sparePartsStatus =
    spareParts?.overall_status === "critical"
      ? "danger"
      : spareParts?.overall_status === "low"
        ? "warning"
        : "ok";

  const fuelStatus =
    (fuelReserves?.reserve_status_percent ?? 100) <=
    (fuelReserves?.thresholds?.critical_depletion_percent ?? 5)
      ? "danger"
      : (fuelReserves?.reserve_status_percent ?? 100) <=
        (fuelReserves?.thresholds?.warning_depletion_percent ?? 15)
        ? "warning"
        : "ok";

  /*
   * Backend spare_parts has nested category data.
   * Convert it into a readable summary for the table.
   */
  const sparePartsTotal =
    (spareParts?.categories?.generator_parts?.fuel_filters ?? 0) +
    (spareParts?.categories?.generator_parts?.oil_filters ?? 0) +
    (spareParts?.categories?.generator_parts?.spark_plugs ?? 0) +
    (spareParts?.categories?.hvac_components?.air_filters ?? 0) +
    (spareParts?.categories?.hvac_components?.heating_elements ?? 0) +
    (spareParts?.categories?.hvac_components?.thermostat_units ?? 0) +
    (spareParts?.categories?.electrical?.circuit_breakers ?? 0) +
    (spareParts?.categories?.electrical?.fuses ?? 0) +
    (spareParts?.categories?.electrical?.wiring_kits ?? 0);

  const inventory = [
    {
      id: food?.item_id || "SUPPLY-FOOD-001",
      category: "Rations",
      item: "Food & Provisions",
      stock: `${food?.current_stock_kg ?? 0} kg`,
      burnRate: `${food?.daily_consumption_kg ?? 0} kg/d`,
      status: foodStatus,
    },

    {
      id: medical?.item_id || "SUPPLY-MEDICAL-001",
      category: "Medical",
      item: "Medical Kits",
      stock: `${medical?.current_stock_percent ?? 0}%`,
      burnRate: "Variable",
      status: medicalStatus,
    },

    {
      id: spareParts?.item_id || "SUPPLY-PARTS-001",
      category: "Mechanical",
      item: "Spare Parts",
      stock: `${sparePartsTotal} units`,
      burnRate: "Low",
      status: sparePartsStatus,
    },

    {
      id: fuelReserves?.item_id || "SUPPLY-FUEL-001",
      category: "Fuel",
      item: "Emergency Reserve",
      stock: `${fuelReserves?.emergency_reserve_liters ?? 0} L`,
      burnRate: "Locked",
      status: fuelStatus,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 overflow-x-auto h-full font-sans">
      <div className="mb-4 flex items-baseline justify-between min-w-[600px]">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Critical Inventory Manifest
        </h3>

        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Top Priority Items
        </span>
      </div>

      <table className="w-full text-left text-sm min-w-[600px]">
        <thead className="border-b border-slate-200 dark:border-slate-700/80 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <tr>
            <th className="pb-3">Item Code</th>
            <th className="pb-3">Category</th>
            <th className="pb-3">Description</th>
            <th className="pb-3">Current Stock</th>
            <th className="pb-3">Burn Rate</th>
            <th className="pb-3 text-right">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {inventory.map((inv) => (
            <tr
              key={inv.id}
              className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
            >
              <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                {inv.id}
              </td>

              <td className="py-3.5 font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                {inv.category === "Medical" && (
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                )}

                {inv.category === "Mechanical" && (
                  <Wrench className="h-4 w-4 text-amber-500" />
                )}

                {inv.category === "Rations" && (
                  <Package className="h-4 w-4 text-orange-400" />
                )}

                {inv.category === "Fuel" && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}

                {inv.category}
              </td>

              <td className="py-3.5 font-semibold text-slate-900 dark:text-slate-100">
                {inv.item}
              </td>

              <td
                className={`py-3.5 font-mono font-bold ${
                  inv.status === "danger"
                    ? "text-red-500"
                    : inv.status === "warning"
                      ? "text-amber-500"
                      : "text-slate-900 dark:text-slate-100"
                }`}
              >
                {inv.stock}
              </td>

              <td className="py-3.5 font-mono text-slate-600 dark:text-slate-300">
                {inv.burnRate}
              </td>

              <td className="py-3.5 text-right">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                    bgColors[inv.status] || "bg-slate-500/10"
                  } ${
                    statusColors[inv.status] || "text-slate-500"
                  }`}
                >
                  {inv.status === "ok"
                    ? "Adequate"
                    : inv.status === "warning"
                      ? "Warning"
                      : "Critical"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}