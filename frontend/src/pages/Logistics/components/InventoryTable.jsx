import { Package } from "lucide-react";

// Helper to safely format numbers to 1 decimal place
const formatMetric = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return Number(val).toFixed(decimals);
};

export default function InventoryTable({ logisticsJson }) {
  if (!logisticsJson) return null;

  const fuel = logisticsJson.fuel_reserves?.primary_tank || {};
  const emergencyFuel = logisticsJson.fuel_reserves?.emergency_reserve || {};
  const food = logisticsJson.supplies?.food || {};
  
  // Pull from either inventory_ledger or items depending on your DB schema
  const backendLedger = logisticsJson.inventory_ledger || logisticsJson.items || [];

  // Combine fixed core metrics with the dynamic backend array items
  const dynamicLedger = [
    {
        item_code: "FUEL-01",
        item_name: "Primary Diesel Fuel",
        category: "Energy / Consumable",
        current_stock: `${formatMetric(fuel.current_level_liters, 1)} L`,
        capacity_max: `${formatMetric(fuel.total_capacity_liters, 0)} L`,
        burn_rate: `${formatMetric(fuel.consumption_rate_liters_per_day, 1)} L/day`,
        status: (fuel.current_level_percent || 0) > 30 ? "OK" : "DANGER"
    },
    {
        item_code: "RAT-01",
        item_name: "Standard Rations",
        category: "Food & Provisions",
        current_stock: `${formatMetric(food.current_stock_kg, 1)} kg`,
        capacity_max: `${formatMetric(food.max_capacity_kg || 4000, 0)} kg`,
        burn_rate: `${formatMetric(food.daily_consumption_kg || food.consumption_rate_kg_per_day, 1)} kg/day`,
        status: food.status === "critical" ? "DANGER" : "OK"
    },
    {
        item_code: "FUEL-EMG",
        item_name: "Emergency Fuel Reserve",
        category: "Energy / Secured",
        current_stock: `${formatMetric(emergencyFuel.current_level_liters, 1)} L`,
        capacity_max: `${formatMetric(emergencyFuel.total_capacity_liters, 0)} L`,
        burn_rate: "0 L/day (Locked)",
        status: "SEALED"
    },
    // Map all custom/delivered items coming from MongoDB
    ...backendLedger.map((item, index) => ({
        item_code: item.item_code || `ITM-${100 + index}`,
        item_name: item.item_name || item.item || "Unknown Item",
        category: item.category || "General Supplies",
        current_stock: `${formatMetric(item.current_stock || item.qty, 1)} Units`,
        capacity_max: item.capacity_max ? `${formatMetric(item.capacity_max, 0)}` : "N/A",
        burn_rate: item.burn_rate || "Incidental",
        status: item.status || "OK"
    }))
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 animate-in fade-in zoom-in-95 duration-300 overflow-x-auto h-full flex flex-col font-sans">
      <div className="mb-4 flex items-baseline justify-between min-w-[800px]">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
            Critical Inventory Manifest
        </h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Top Priority Items ({dynamicLedger.length})
        </span>
      </div>

      <div className="flex-1">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="border-b border-slate-200 dark:border-slate-700/80 text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <tr>
              <th className="pb-3 px-4">Item Code</th>
              <th className="pb-3 px-4">Category</th>
              <th className="pb-3 px-4">Description</th>
              <th className="pb-3 px-4">Current Stock</th>
              <th className="pb-3 px-4">Burn Rate</th>
              <th className="pb-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {dynamicLedger.map((row, idx) => {
              let pillColor = "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50";
              const upperStatus = (row.status || "OK").toUpperCase();
              
              if (upperStatus.includes("DANGER") || upperStatus.includes("LOW") || upperStatus.includes("WARN") || upperStatus === "CRITICAL") {
                  pillColor = "bg-red-950/40 text-red-400 border border-red-900/50";
              } else if (upperStatus === "SEALED" || upperStatus === "LOCKED") {
                  pillColor = "bg-slate-800 text-slate-300 border border-slate-700";
              }

              return (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-xs text-slate-600 dark:text-slate-400">
                    {row.item_code}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">
                    {row.category}
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                    {row.item_name}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {row.current_stock}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {row.burn_rate}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[0.6rem] font-bold uppercase tracking-wider ${pillColor}`}>
                      {upperStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}