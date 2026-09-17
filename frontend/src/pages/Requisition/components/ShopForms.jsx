import { useState } from "react";
import { PackagePlus, PackageCheck } from "lucide-react";
import CustomDropdown from "../../../components/context/CustomDropdown";

export function OrderForm({ onSubmit, role }) {
    const [item, setItem] = useState("");
    const [qty, setQty] = useState(1);
    const [priority, setPriority] = useState("Medium");
    const [category, setCategory] = useState("Mechanical");
    const [notes, setNotes] = useState("");

    const priorityOptions = [
        { label: "Low", value: "Low" },
        { label: "Medium", value: "Medium" },
        { label: "High", value: "High" },
        { label: "Critical", value: "Critical" }
    ];

    const categoryOptions = [
        { label: "Mechanical/Parts", value: "Mechanical" },
        { label: "Medical Supplies", value: "Medical" },
        { label: "Food/Rations", value: "Food" },
        { label: "Scientific Gear", value: "Scientific" },
        { label: "Fuel/Consumables", value: "Fuel" }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!item.trim()) return;
        onSubmit({ item, qty, priority, category, notes });
        setItem(""); setQty(1); setNotes(""); setPriority("Medium"); setCategory("Mechanical");
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 font-sans transition-colors duration-300">
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                {role === "authority" ? "Direct Order Override" : "New Requisition Request"}
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Item Description</label>
                    <input type="text" value={item} onChange={(e) => setItem(e.target.value)} required placeholder="e.g. Thermal Sensors" className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 font-medium" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                    <CustomDropdown 
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        options={categoryOptions}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Quantity</label>
                        <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} required className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-colors text-slate-900 dark:text-white font-mono font-semibold" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Priority</label>
                        <CustomDropdown 
                            name="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            options={priorityOptions}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Justification / Notes</label>
                    <textarea 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)} 
                        placeholder="Why is this needed? (Optional)" 
                        rows="2"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 font-medium resize-none" 
                    />
                </div>

                <button type="submit" className={`w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-transform active:scale-[0.98] mt-2 ${role === "authority" ? "bg-red-600 hover:bg-red-700" : "bg-cyan-600 hover:bg-cyan-700"}`}>
                    {role === "authority" ? "Authorize & Dispatch" : "Submit Request"}
                </button>
            </div>
        </form>
    );
}

export function DirectInventoryForm({ onAdd }) {
    const [item, setItem] = useState("");
    const [qty, setQty] = useState(1);
    const [category, setCategory] = useState("Mechanical");

    const categoryOptions = [
        { label: "Mechanical/Parts", value: "Mechanical" },
        { label: "Medical Supplies", value: "Medical" },
        { label: "Food/Rations", value: "Rations" },
        { label: "Scientific Gear", value: "Scientific" },
        { label: "Fuel/Consumables", value: "Fuel" }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ item, qty, category, priority: "Logged" });
        setItem(""); setQty(1);
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 font-sans transition-colors duration-300">
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-emerald-500" />
                Direct Stock Entry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 font-medium leading-relaxed">Bypass requisition queue for direct physical deliveries or local audits.</p>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Item Description</label>
                    <input type="text" value={item} onChange={(e) => setItem(e.target.value)} required className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-colors text-slate-900 dark:text-white font-medium" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                    <CustomDropdown 
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        options={categoryOptions}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Quantity Logged</label>
                    <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} required className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-colors text-slate-900 dark:text-white font-mono font-semibold" />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-transform active:scale-[0.98] mt-2">
                    Log to Local Inventory
                </button>
            </div>
        </form>
    );
}