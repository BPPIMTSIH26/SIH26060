import { Package, Wrench, ShieldCheck, AlertTriangle } from "lucide-react";

const statusColors = { ok: "text-emerald-600 dark:text-emerald-500", warning: "text-amber-600 dark:text-amber-500", danger: "text-red-600 dark:text-red-500" };
const bgColors = { ok: "bg-emerald-500/10", warning: "bg-amber-500/10", danger: "bg-red-500/10" };

export default function InventoryTable({ logisticsJson }) {
  if (!logisticsJson) return null;

  const { supplies, fuel_reserves } = logisticsJson;

  const inventory = [
    { id: supplies?.food?.item_id, category: "Rations", item: "Food & Provisions", stock: `${supplies?.food?.current_stock_kg} kg`, burnRate: `${supplies?.food?.daily_consumption_kg} kg/d`, status: supplies?.food?.status === "adequate" ? "ok" : "danger" },
    { id: supplies?.medical?.item_id, category: "Medical", item: "Medical Kits", stock: `${supplies?.medical?.current_stock_percent}%`, burnRate: "Variable", status: "ok" },
    { id: supplies?.spare_parts?.item_id, category: "Mechanical", item: "Spare Parts", stock: "Adequate", burnRate: "Low", status: "ok" },
    { id: fuel_reserves?.item_id, category: "Fuel", item: "Emergency Reserve", stock: `${fuel_reserves?.emergency_reserve_liters} L`, burnRate: "0 L/d", status: "ok" }
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 overflow-x-auto h-full font-sans">
      <div className="mb-4 flex items-baseline justify-between min-w-[600px]">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Critical Inventory Manifest</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Top Priority Items</span>
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
            <tr key={inv.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
              <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">{inv.id}</td>
              <td className="py-3.5 font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                {inv.category === "Medical" && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                {inv.category === "Mechanical" && <Wrench className="h-4 w-4 text-amber-500" />}
                {inv.category === "Scientific" && <AlertTriangle className="h-4 w-4 text-cyan-500" />}
                {inv.category === "Rations" && <Package className="h-4 w-4 text-orange-400" />}
                {inv.category === "Fuel" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                {inv.category}
              </td>
              <td className="py-3.5 font-semibold text-slate-900 dark:text-slate-100">{inv.item}</td>
              <td className={`py-3.5 font-mono font-bold ${inv.status === 'danger' ? 'text-red-500' : 'text-slate-900 dark:text-slate-100'}`}>{inv.stock}</td>
              <td className="py-3.5 font-mono text-slate-600 dark:text-slate-300">{inv.burnRate}</td>
              <td className="py-3.5 text-right">
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${bgColors[inv.status]} ${statusColors[inv.status]}`}>
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