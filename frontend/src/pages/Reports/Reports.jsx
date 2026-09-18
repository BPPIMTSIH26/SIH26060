import { useState } from 'react';
import { FileDown, Calendar, Filter, FileText, Database, Activity, Wind, Download, Beaker } from 'lucide-react';

export default function Reports() {
    const [dateRange, setDateRange] = useState('Last 7 Days');

    return (
        <div className="min-h-screen bg-amber-50/30 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
            <div className="max-w-[1500px] mx-auto">

                {/* HEADER SECTION */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Mission Reports & Data Export
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                            Generate, filter, and download historical telemetry and research data.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                            <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
                            {dateRange}
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold shadow-md transition-all active:scale-95">
                            <FileDown className="w-4 h-4" />
                            Export Master Log
                        </button>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT COLUMN: Data Selection (Takes up 2 columns on large screens) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Database className="w-5 h-5 text-cyan-500" />
                                    Available Data Modules
                                </h2>
                                <button className="text-sm text-gray-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 flex items-center gap-1 transition-colors">
                                    <Filter className="w-4 h-4" /> Filter Modules
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Placeholder Modules - We will hook these up to your real data later */}
                                <DataCard
                                    title="Atmospheric & Weather"
                                    icon={<Wind className="w-5 h-5 text-blue-500 dark:text-blue-400" />}
                                    desc="Wind speed, temperature drifts, UV index, and blizzard history."
                                />
                                <DataCard
                                    title="Telemetry & Power Grid"
                                    icon={<Activity className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />}
                                    desc="Generator load, battery discharge rates, and HVAC performance."
                                />
                                <DataCard
                                    title="Scientific Research"
                                    icon={<Beaker className="w-5 h-5 text-purple-500 dark:text-purple-400" />}
                                    desc="Glaciology, oceanography, and atmospheric chemistry readings."
                                />
                                <DataCard
                                    title="Logistics & Inventory"
                                    icon={<FileText className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
                                    desc="Fuel burn rates, food consumption, and ledger history."
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Recent Downloads / History */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Recent Exports
                            </h2>

                            <div className="space-y-2">
                                {/* Placeholder History Items */}
                                <RecentItem name="Maitri_Q3_Logistics.csv" date="Today, 14:30 IST" size="1.2 MB" />
                                <RecentItem name="Bharati_Science_Data.xlsx" date="Yesterday, 09:15 IST" size="4.5 MB" />
                                <RecentItem name="Env_Telemetry_Weekly.json" date="Sep 15, 18:45 IST" size="890 KB" />
                            </div>

                            <button className="w-full mt-6 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                View Complete History
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function DataCard({ title, icon, desc }) {
    return (
        <div className="p-5 rounded-xl border border-amber-100 dark:border-slate-800 bg-amber-50/50 dark:bg-slate-800/30 hover:border-cyan-300 dark:hover:border-cyan-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 group-hover:shadow-md transition-shadow">
                    {icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-slate-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                    {title}
                </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                {desc}
            </p>
        </div>
    );
}

function RecentItem({ name, date, size }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-amber-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border border-transparent hover:border-amber-200/60 dark:hover:border-slate-700 group">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                        {name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[11px] font-medium text-gray-500 dark:text-slate-500">{date}</p>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600"></span>
                        <p className="text-[11px] font-medium text-gray-400 dark:text-slate-500">{size}</p>
                    </div>
                </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
            </button>
        </div>
    );
}