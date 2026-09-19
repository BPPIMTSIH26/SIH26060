/* eslint-disable react-hooks/static-components */
import { CheckCircle2, AlertTriangle, AlertOctagon, ShieldAlert, Zap, Droplet, Wind, Thermometer, Box, Activity, Home } from 'lucide-react';

const ProgressBar = ({ label, value, colorClass, suffix = "%", max = 100 }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</span>
        <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">{value}{suffix}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${colorClass}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const TelemetryItem = ({ icon, label, value, subValue }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">{icon}</div>
      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-right">
      <div className="text-sm font-mono font-black text-slate-900 dark:text-white">{value}</div>
      {subValue && <div className="text-[10px] font-medium text-slate-500">{subValue}</div>}
    </div>
  </div>
);

const StatCard = ({ title, value, unit, colorClass, indicatorColorClass }) => (
  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
    {indicatorColorClass && <div className={`absolute top-0 left-0 w-full h-1 ${indicatorColorClass}`}></div>}
    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
    <p className={`text-3xl font-black mt-2 font-mono ${colorClass || 'text-slate-900 dark:text-white'}`}>
      {value}{unit && <span className="text-lg text-slate-400 ml-1">{unit}</span>}
    </p>
  </div>
);

export default function VisualSummaryTab({ reportData, reportCategory }) {
  const getStatusIcon = (status) => {
    if (status === "GREEN") return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
    if (status === "YELLOW") return <AlertTriangle className="w-6 h-6 text-amber-500" />;
    return <AlertOctagon className="w-6 h-6 text-red-500" />;
  };

  const IntelligenceTerminal = () => {
    const filterByScope = (items) => {
      if (reportCategory === 'overall') return items;
      return items.filter(item => {
        const str = item.toLowerCase();
        if (reportCategory === 'energy') return str.includes('power') || str.includes('gen') || str.includes('fuel') || str.includes('grid');
        if (reportCategory === 'environment') return str.includes('temp') || str.includes('wind') || str.includes('weather');
        if (reportCategory === 'logistics') return str.includes('shipment') || str.includes('stock') || str.includes('supply');
        if (reportCategory === 'infrastructure') return str.includes('module') || str.includes('hvac') || str.includes('structural');
        return true;
      });
    };

    const hls = filterByScope(reportData.executive_summary?.key_highlights || []);
    const acts = filterByScope(reportData.executive_summary?.recommended_actions || []);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="rounded-2xl border border-emerald-200/50 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/10 p-6">
          <h3 className="text-xs font-bold tracking-widest text-emerald-700 dark:text-emerald-500/80 mb-5 uppercase">Targeted Highlights</h3>
          <ul className="space-y-4">
            {hls.length > 0 ? hls.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-emerald-900 dark:text-emerald-100/90 font-medium leading-relaxed">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500/70" /> {highlight}
              </li>
            )) : <li className="text-sm text-emerald-700/50 italic">No specific highlights for {reportCategory}.</li>}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <h3 className="text-xs font-bold tracking-widest text-amber-700 dark:text-amber-500/80 mb-5 uppercase pl-2">Required Actions</h3>
          <ul className="space-y-4 pl-2">
            {acts.length > 0 ? acts.map((action, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-amber-900 dark:text-amber-200/90 font-medium leading-relaxed">
                <ShieldAlert className="w-5 h-5 shrink-0 text-amber-500" /> {action}
              </li>
            )) : <li className="text-sm text-amber-700/50 italic">No specific actions required.</li>}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* OVERALL VIEW */}
      {reportCategory === 'overall' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Health Index" value={reportData.executive_summary?.overall_health_score || 0} unit="/100" indicatorColorClass="bg-cyan-500" />
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${reportData.executive_summary?.operational_status === "GREEN" ? "bg-emerald-500" : reportData.executive_summary?.operational_status === "YELLOW" ? "bg-amber-500" : "bg-red-500"}`}></div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Grid Status</p>
              <div className="flex items-center gap-3 mt-2">
                {getStatusIcon(reportData.executive_summary?.operational_status)}
                <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{reportData.executive_summary?.operational_status}</p>
              </div>
            </div>
            <StatCard title="Net Power Margin" value={reportData.energy_analysis?.metrics?.net_deficit_kw || 0} unit="kW" colorClass={reportData.energy_analysis?.metrics?.net_deficit_kw < 0 ? "text-red-500" : "text-emerald-500"} indicatorColorClass={reportData.energy_analysis?.metrics?.net_deficit_kw < 0 ? "bg-red-500" : "bg-emerald-500"} />
            <StatCard title="Critical Alerts" value={reportData.executive_summary?.critical_alerts_count || 0} colorClass={(reportData.executive_summary?.critical_alerts_count || 0) > 0 ? "text-red-500" : "text-slate-900 dark:text-white"} indicatorColorClass={(reportData.executive_summary?.critical_alerts_count || 0) > 0 ? "bg-red-500" : "bg-slate-700"} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-bold tracking-widest text-slate-400 mb-6 uppercase flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Energy & Reserves</h3>
              <ProgressBar label="Battery Charge Capacity" value={reportData.energy_analysis?.metrics?.battery_charge_percent || 0} colorClass="bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              <ProgressBar label="Primary Fuel Tank Level" value={reportData.energy_analysis?.fuel_status?.fuel_level_percent || 0} colorClass="bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-bold tracking-widest text-slate-400 mb-6 uppercase flex items-center gap-2"><Wind className="w-4 h-4 text-blue-500" /> Environment & Logistics</h3>
              <div className="space-y-3">
                <TelemetryItem icon={<Thermometer className="w-4 h-4 text-blue-500" />} label="Exterior Temp" value={`${reportData.environment_analysis?.metrics?.outside_temp_c || 0}°C`} subValue="Absolute" />
                <TelemetryItem icon={<Wind className="w-4 h-4 text-slate-400" />} label="Wind Velocity" value={`${reportData.environment_analysis?.metrics?.wind_speed_kmh || 0} km/h`} subValue={reportData.environment_analysis?.metrics?.blizzard_active ? "BLIZZARD CONDITIONS" : "Clear"} />
                <TelemetryItem icon={<Droplet className="w-4 h-4 text-amber-600" />} label="Food Stock Status" value={`${reportData.logistics_analysis?.supplies?.food?.current_stock_days || 0} Days`} subValue="Days Remaining" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ENERGY VIEW */}
      {reportCategory === 'energy' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Net Power Deficit" value={reportData.energy_analysis?.metrics?.net_deficit_kw || 0} unit="kW" colorClass={reportData.energy_analysis?.metrics?.net_deficit_kw < 0 ? "text-red-500" : "text-emerald-500"} indicatorColorClass={reportData.energy_analysis?.metrics?.net_deficit_kw < 0 ? "bg-red-500" : "bg-emerald-500"} />
            <StatCard title="Average Gen" value={reportData.energy_analysis?.metrics?.average_generation_kw || 0} unit="kW" colorClass="text-emerald-500" indicatorColorClass="bg-emerald-500" />
            <StatCard title="Average Load" value={reportData.energy_analysis?.metrics?.average_load_kw || 0} unit="kW" colorClass="text-amber-500" indicatorColorClass="bg-amber-500" />
            <StatCard title="Energy Health" value={reportData.system_health_breakdown?.energy_score || 0} unit="/100" indicatorColorClass="bg-cyan-500" />
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 mb-6 uppercase flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Storage & Fuel Reserves</h3>
            <ProgressBar label="Battery System Charge" value={reportData.energy_analysis?.metrics?.battery_charge_percent || 0} colorClass="bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <ProgressBar label="Diesel Reserve Level" value={reportData.energy_analysis?.fuel_status?.fuel_level_percent || 0} colorClass="bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          </div>
        </>
      )}

      {/* ENVIRONMENT VIEW */}
      {reportCategory === 'environment' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Outside Temp" value={reportData.environment_analysis?.metrics?.outside_temp_c || 0} unit="°C" colorClass="text-blue-500" indicatorColorClass="bg-blue-500" />
          <StatCard title="Wind Speed" value={reportData.environment_analysis?.metrics?.wind_speed_kmh || 0} unit="km/h" colorClass="text-slate-300" indicatorColorClass="bg-slate-500" />
          <StatCard title="Visibility" value={reportData.environment_analysis?.metrics?.visibility_meters || 0} unit="m" indicatorColorClass="bg-cyan-500" />
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${reportData.environment_analysis?.metrics?.blizzard_active ? "bg-red-500" : "bg-emerald-500"}`}></div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Blizzard State</p>
            <p className={`text-xl font-black mt-2 tracking-tight ${reportData.environment_analysis?.metrics?.blizzard_active ? "text-red-500" : "text-emerald-500"}`}>
              {reportData.environment_analysis?.metrics?.blizzard_active ? "ACTIVE" : "CLEAR"}
            </p>
          </div>
        </div>
      )}

      {/* LOGISTICS VIEW */}
      {reportCategory === 'logistics' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Logistics Health" value={reportData.system_health_breakdown?.logistics_score || 0} unit="/100" indicatorColorClass="bg-amber-500" />
          <StatCard title="Food Stock" value={reportData.logistics_analysis?.supplies?.food?.current_stock_days || 0} unit="Days" colorClass="text-emerald-500" indicatorColorClass="bg-emerald-500" />
          <StatCard title="Medical Supplies" value={reportData.logistics_analysis?.supplies?.medical?.current_stock_percent || 0} unit="%" colorClass="text-cyan-500" indicatorColorClass="bg-cyan-500" />
          <StatCard title="Personnel" value={reportData.logistics_analysis?.personnel?.on_station || 0} unit="Pax" indicatorColorClass="bg-slate-500" />
        </div>
      )}

      {/* INFRASTRUCTURE VIEW */}
      {reportCategory === 'infrastructure' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Infra Score" value={reportData.system_health_breakdown?.infrastructure_score || 0} unit="/100" indicatorColorClass="bg-purple-500" />
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${reportData.system_health_breakdown?.infrastructure_status === "GREEN" ? "bg-emerald-500" : "bg-amber-500"}`}></div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Structure Status</p>
              <p className={`text-xl font-black mt-2 tracking-tight ${reportData.system_health_breakdown?.infrastructure_status === "GREEN" ? "text-emerald-500" : "text-amber-500"}`}>
                {reportData.system_health_breakdown?.infrastructure_status || "NOMINAL"}
              </p>
            </div>
            <StatCard title="Main Lab Temp" value={reportData.infrastructure_analysis?.modules?.main_lab?.average_temperature_c || 0} unit="°C" colorClass="text-emerald-500" indicatorColorClass="bg-emerald-500" />
            <StatCard title="Quarters Temp" value={reportData.infrastructure_analysis?.modules?.living_quarters?.average_temperature_c || 0} unit="°C" colorClass="text-emerald-500" indicatorColorClass="bg-emerald-500" />
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 mb-6 uppercase flex items-center gap-2"><Home className="w-4 h-4 text-purple-500" /> Module Status Overview</h3>
            <div className="space-y-3">
              <TelemetryItem icon={<Box className="w-4 h-4 text-slate-400" />} label="Storage Module" value={`${reportData.infrastructure_analysis?.modules?.storage?.average_temperature_c || 0}°C`} subValue={`Status: ${reportData.infrastructure_analysis?.modules?.storage?.status || 'Unknown'}`} />
              <TelemetryItem icon={<Activity className="w-4 h-4 text-slate-400" />} label="HVAC System" value={reportData.infrastructure_analysis?.hvac_system?.status?.toUpperCase() || 'NOMINAL'} subValue="Main Ventilation" />
            </div>
          </div>
        </>
      )}

      <IntelligenceTerminal />
    </div>
  );
}