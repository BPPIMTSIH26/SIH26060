import React, { useState } from "react";
import { PackagePlus, PackageCheck } from "lucide-react";
import CustomDropdown from "../../../components/context/CustomDropdown";

export function OrderForm({ onSubmit, role }) {
    const [item, setItem] = useState("");
    const [qty, setQty] = useState(1);
    const [priority, setPriority] = useState("Medium");

    const priorityOptions = [
        { label: "Low", value: "Low" },
        { label: "Medium", value: "Medium" },
        { label: "High", value: "High" },
        { label: "Critical", value: "Critical" }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!item.trim()) return;
        onSubmit({ item, qty, priority });
        setItem(""); setQty(1); setPriority("Medium");
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-5 shadow-sm font-sans">
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-cyan-600" />
                {role === "authority" ? "Direct Order Override" : "New Requisition"}
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">Item Description</label>
                    <input type="text" value={item} onChange={(e) => setItem(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-colors text-gray-900 dark:text-white placeholder:text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">Quantity</label>
                        <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-colors text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">Priority</label>
                        <CustomDropdown 
                            name="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            options={priorityOptions}
                        />
                    </div>
                </div>
                <button type="submit" className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition-transform active:scale-95 mt-4 ${role === "authority" ? "bg-red-600 hover:bg-red-700" : "bg-cyan-600 hover:bg-cyan-700"}`}>
                    {role === "authority" ? "Authorize & Dispatch" : "Submit Request"}
                </button>
            </div>
        </form>
    );
}

export function DirectInventoryForm({ onAdd }) {
    const [item, setItem] = useState("");
    const [qty, setQty] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ item, qty, priority: "Logged" });
        setItem(""); setQty(1);
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-5 shadow-sm font-sans">
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-emerald-500" />
                Direct Stock Entry
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">Bypass requisition queue for direct physical deliveries or audits.</p>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">Item Description</label>
                    <input type="text" value={item} onChange={(e) => setItem(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-colors text-gray-900 dark:text-white" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1.5">Quantity Logged</label>
                    <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-colors text-gray-900 dark:text-white" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-transform active:scale-95">
                    Log to Inventory
                </button>
            </div>
        </form>
    );
}