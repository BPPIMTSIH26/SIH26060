
import { Package, Wrench, ShieldCheck, AlertTriangle } from "lucide-react";

const statusColors = { ok: "text-emerald-500", warning: "text-amber-500", danger: "text-red-500" };
const bgColors = { ok: "bg-emerald-100 dark:bg-emerald-900/30", warning: "bg-amber-100 dark:bg-amber-900/30", danger: "bg-red-100 dark:bg-red-900/30" };

export default function InventoryTable({ logisticsJson }) {
  if (!logisticsJson) return null;

  const { supplies, fuel_reserves } = logisticsJson;

  // Build the inventory array natively from the JSON
  const inventory = [
    { id: supplies?.food?.item_id, category: "Rations", item: "Food & Provisions", stock: `${supplies?.food?.current_stock_kg} kg`, burnRate: `${supplies?.food?.daily_consumption_kg} kg/d`, status: supplies?.food?.status === "adequate" ? "ok" : "danger" },
    { id: supplies?.medical?.item_id, category: "Medical", item: "Medical Kits", stock: `${supplies?.medical?.current_stock_percent}%`, burnRate: "Variable", status: "ok" },
    { id: supplies?.spare_parts?.item_id, category: "Mechanical", item: "Spare Parts", stock: "Adequate", burnRate: "Low", status: "ok" },
    { id: fuel_reserves?.item_id, category: "Fuel", item: "Emergency Reserve", stock: `${fuel_reserves?.emergency_reserve_liters} L`, burnRate: "0 L/d", status: "ok" }
  ];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300 overflow-x-auto">
      <div className="mb-4 flex items-baseline justify-between min-w-[600px]">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Critical Inventory Manifest</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Top Priority Items</span>
      </div>
      
      <table className="w-full text-left font-mono text-sm min-w-[600px]">
        <thead className="border-b border-gray-200 dark:border-slate-700/80 text-[0.65rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">
          <tr>
            <th className="pb-3 font-medium">Item Code</th>
            <th className="pb-3 font-medium">Category</th>
            <th className="pb-3 font-medium">Description</th>
            <th className="pb-3 font-medium">Current Stock</th>
            <th className="pb-3 font-medium">Burn Rate</th>
            <th className="pb-3 font-medium text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-slate-800/80">
          {inventory.map((inv) => (
            <tr key={inv.id} className="transition-colors hover:bg-white/50 dark:hover:bg-slate-800/30">
              <td className="py-3 font-bold text-gray-900 dark:text-slate-100">{inv.id}</td>
              <td className="py-3 text-gray-600 dark:text-slate-300 flex items-center gap-1.5">
                {inv.category === "Medical" && <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />}
                {inv.category === "Mechanical" && <Wrench className="h-3.5 w-3.5 text-amber-500" />}
                {inv.category === "Scientific" && <AlertTriangle className="h-3.5 w-3.5 text-cyan-500" />}
                {inv.category === "Rations" && <Package className="h-3.5 w-3.5 text-orange-400" />}
                {inv.category === "Fuel" && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
                {inv.category}
              </td>
              <td className="py-3 text-gray-900 dark:text-slate-100">{inv.item}</td>
              <td className={`py-3 font-bold ${inv.status === 'danger' ? 'text-red-500' : 'text-gray-900 dark:text-slate-100'}`}>{inv.stock}</td>
              <td className="py-3 text-gray-600 dark:text-slate-300">{inv.burnRate}</td>
              <td className="py-3 text-right">
                <span className={`inline-flex items-center rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${bgColors[inv.status]} ${statusColors[inv.status]}`}>
                  {inv.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}