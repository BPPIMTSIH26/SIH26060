export default function DataTableTab({ reportData, reportCategory }) {
    const getTableRows = () => {
        const allRows = [
            { cat: 'Energy', path: 'energy_analysis.metrics.average_generation_kw', val: reportData.energy_analysis?.metrics?.average_generation_kw || 0, color: 'text-emerald-500' },
            { cat: 'Energy', path: 'energy_analysis.metrics.average_load_kw', val: reportData.energy_analysis?.metrics?.average_load_kw || 0, color: 'text-emerald-500' },
            { cat: 'Energy', path: 'energy_analysis.metrics.battery_charge_percent', val: reportData.energy_analysis?.metrics?.battery_charge_percent || 0, color: 'text-emerald-500' },
            { cat: 'Environment', path: 'environment_analysis.metrics.outside_temp_c', val: reportData.environment_analysis?.metrics?.outside_temp_c || 0, color: 'text-blue-500' },
            { cat: 'Environment', path: 'environment_analysis.metrics.wind_speed_kmh', val: reportData.environment_analysis?.metrics?.wind_speed_kmh || 0, color: 'text-blue-500' },
            { cat: 'Environment', path: 'environment_analysis.metrics.visibility_meters', val: reportData.environment_analysis?.metrics?.visibility_meters || 0, color: 'text-blue-500' },
            { cat: 'Logistics', path: 'logistics_analysis.supplies.food.current_stock_days', val: reportData.logistics_analysis?.supplies?.food?.current_stock_days || 0, color: 'text-amber-500' },
            { cat: 'Logistics', path: 'logistics_analysis.supplies.medical.current_stock_percent', val: reportData.logistics_analysis?.supplies?.medical?.current_stock_percent || 0, color: 'text-amber-500' },
            { cat: 'Logistics', path: 'logistics_analysis.personnel.on_station', val: reportData.logistics_analysis?.personnel?.on_station || 0, color: 'text-amber-500' },
            { cat: 'Infrastructure', path: 'system_health_breakdown.infrastructure_score', val: reportData.system_health_breakdown?.infrastructure_score || 0, color: 'text-purple-500' },
            { cat: 'Infrastructure', path: 'infrastructure_analysis.modules.main_lab.average_temperature_c', val: reportData.infrastructure_analysis?.modules?.main_lab?.average_temperature_c || 0, color: 'text-purple-500' },
        ];
        if (reportCategory === 'overall') return allRows;
        return allRows.filter(r => r.cat.toLowerCase() === reportCategory);
    };

    return (
        <div className="space-y-6 animate-in fade-in bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                            <th className="p-4 border-b border-slate-200 dark:border-slate-800">Metric Category</th>
                            <th className="p-4 border-b border-slate-200 dark:border-slate-800">Absolute Parameter Path</th>
                            <th className="p-4 border-b border-slate-200 dark:border-slate-800 text-right">Recorded Value</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                        {getTableRows().map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                <td className={`p-4 font-bold ${row.color}`}>{row.cat}</td>
                                <td className="p-4 font-mono text-xs text-slate-500">{row.path}</td>
                                <td className="p-4 font-mono font-bold text-right">{row.val}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}