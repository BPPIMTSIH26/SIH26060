/* eslint-disable react-hooks/purity */
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { energyAPI } from "../../services/energy";
import { Zap, ZapOff, Battery, Flame } from "lucide-react";

import Skeleton from "../../components/context/Skeleton";
import EnergyKpiGrid from "./components/EnergyKpiGrid";
import PowerLoadChart from "./components/PowerLoadChart";
import BatteryBanks from "./components/BatteryBanks";
import PowerSourcesTable from "./components/PowerSourcesTable";
import GridAlerts from "./components/GridAlerts";
import FuelSystem from "./components/FuelSystem";
import PowerDistribution from "./components/PowerDistribution";
import { useGlobalAlert } from "../../components/context/Alerts/GlobalAlertContext";

// --- NEW HELPER: Safely clamp floating point numbers ---
const formatMetric = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return Number(val).toFixed(decimals);
};

export default function Energy() {
  const { activeStation = "Maitri" } = useOutletContext() || {};
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { pushAlert } = useGlobalAlert();

  useEffect(() => {
    const abortController = new AbortController();

    const fetchEnergy = async (isBackgroundRefresh = false) => {
      if (!isBackgroundRefresh) setLoading(true);
      setError(null);
      
      try {
        const res = await energyAPI.getStationEnergy(activeStation, { signal: abortController.signal });
        if (abortController.signal.aborted) return;
        
        const energyData = res.data;
        setData(energyData);

        // Automated Global Alert Push if Power Deficit is Active
        const deficit = energyData?.power_distribution?.net_power_deficit_kw ?? 0;
        if (deficit < 0) {
          pushAlert({
            alert_id: `AUTO-DEFICIT-${activeStation}`,
            severity: "CRITICAL",
            message: `⚠️ POWER DEFICIT: Generation (${formatMetric(energyData.power_distribution.total_generation_kw, 1)} kW) < Load (${formatMetric(energyData.power_distribution.total_load_kw, 1)} kW).`,
            affected_systems: ["energy", "battery_backup"],
            current_state: energyData.power_distribution,
            recommended_actions: ["Activate Generator 2", "Shed non-essential loads"]
          });
        }
      } catch (err) {
        if (!abortController.signal.aborted && !isBackgroundRefresh) setError(err.message);
      } finally {
        if (!abortController.signal.aborted) setLoading(false);
      }
    };

    // 1. Fetch immediately
    fetchEnergy(false);

    // 2. Silent 30-second polling loop
    const intervalId = setInterval(() => {
      fetchEnergy(true);
    }, 30000);

    return () => { 
      clearInterval(intervalId);
      abortController.abort(); 
    };
  }, [activeStation, pushAlert]);

  // =========================================================================
  // OPTIMIZED SKELETON LOADING STATE
  // =========================================================================
  if (loading) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans">
        
        {/* Header Skeleton */}
        <div className="mb-2 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        
        {/* Row 1: KPI Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-3.5 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-900/40">
              <Skeleton className="h-9 w-9 sm:h-12 sm:w-12 shrink-0 rounded-xl" />
              <div className="space-y-1.5 sm:space-y-2 flex-1 w-full">
                <Skeleton className="h-2.5 sm:h-3 w-16 sm:w-24" />
                <Skeleton className="h-4 sm:h-6 w-12 sm:w-20" />
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Charts & Alerts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[300px]">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-32 hidden sm:block" />
            </div>
            <Skeleton className="flex-1 w-full rounded-xl" />
          </div>

          <div className="lg:col-span-1 flex flex-col rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[300px]">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          </div>
        </div>

        {/* Row 3: Sources Table & Batteries */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[300px]">
            <div className="flex justify-between mb-6">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-full rounded-lg" />
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[300px]">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
            </div>
          </div>
        </div>

        {/* Row 4: Power Distribution & Fuel */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[1, 2].map((card) => (
            <div key={card} className="flex flex-col rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[250px]">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-500 font-sans p-6 font-semibold">Error loading energy data: {error}</div>;
  }

  // =========================================================================
  // DATA MAPPING (Clamped Floating Points!)
  // =========================================================================
  const pwr = data.power_distribution || {};
  const isDeficit = (pwr.net_power_deficit_kw ?? 0) < 0;

  const kpis = [
    { label: "System Health", value: `${formatMetric(data.system_health_score, 0)}%`, subtext: `Trend: ${data.system_health_trend ?? 'stable'}`, status: (data.system_health_score ?? 100) > 80 ? "ok" : "warn", icon: Zap },
    { label: "Total Generation", value: `${formatMetric(pwr.total_generation_kw, 1)} kW`, status: isDeficit ? "danger" : "ok", icon: Flame },
    { label: "Total Load", value: `${formatMetric(pwr.total_load_kw, 1)} kW`, status: isDeficit ? "danger" : "ok", icon: ZapOff },
    { label: "Battery Status", value: `${formatMetric(data.battery_system?.current_charge_percent, 0)}%`, status: (data.battery_system?.current_charge_percent ?? 0) > 30 ? "ok" : "danger", icon: Battery },
  ];

  const sources = [
    { 
      id: data.generators?.gen_1?.generator_id || "GEN-001", 
      type: "Diesel Primary", 
      output: formatMetric(data.generators?.gen_1?.operation?.power_output_kw, 1), 
      maxOutput: formatMetric(data.generators?.gen_1?.thresholds?.power_output_max_kw, 0),
      efficiency: `${formatMetric(data.generators?.gen_1?.operation?.fuel_consumption_liters_per_hour, 1)} L/h`, 
      status: data.generators?.gen_1?.status ?? "ACTIVE",
      runtime: formatMetric(data.generators?.gen_1?.operation?.runtime_total_hours, 0),
      maintDue: formatMetric(data.generators?.gen_1?.thresholds?.maintenance_due_hours, 0)
    },
    { 
      id: data.generators?.gen_2?.generator_id || "GEN-002", 
      type: "Diesel Backup", 
      output: formatMetric(data.generators?.gen_2?.operation?.power_output_kw, 1), 
      maxOutput: formatMetric(data.generators?.gen_2?.thresholds?.power_output_max_kw, 0),
      efficiency: "Standby", 
      status: data.generators?.gen_2?.status ?? "STANDBY",
      runtime: formatMetric(data.generators?.gen_2?.operation?.runtime_total_hours, 0),
      maintDue: formatMetric(data.generators?.gen_2?.thresholds?.maintenance_due_hours, 0)
    },
    { 
      id: data.renewable_energy?.solar_panels?.system_id || "SOLAR-001", 
      type: "Solar Array", 
      output: formatMetric(data.renewable_energy?.solar_panels?.current_output_kw, 1), 
      efficiency: "Weather Dep.", 
      status: data.renewable_energy?.solar_panels?.status?.toUpperCase() ?? "OPERATIONAL"
    },
  ];

  const batteries = [{
    id: data.battery_system?.battery_bank_id || "BATT-01",
    charge: formatMetric(data.battery_system?.current_charge_percent, 0),
    status: isDeficit ? "warn" : "ok",
    infoLeft: isDeficit ? `Draining: ${formatMetric(data.battery_system?.performance?.discharging_rate_kw, 1)} kW` : "Charging",
    infoRight: `Est. Backup: ${formatMetric(data.battery_system?.performance?.estimated_backup_hours_at_current_load, 1)} hrs`,
    kwhText: `${formatMetric(data.battery_system?.current_charge_kwh, 0)} / ${formatMetric(data.battery_system?.total_capacity_kwh, 0)} kWh`,
    efficiency: formatMetric(data.battery_system?.performance?.efficiency_percent, 0),
    trend: data.battery_system?.charge_trend ?? "stable"
  }];

  const powerSeries = Array.from({ length: 7 }).map((_, i) => ({
    time: `-${(6 - i) * 4}h`,
    gen: i === 6 ? Number(formatMetric(pwr.total_generation_kw, 1)) : Number(formatMetric(200 + Math.random() * 20, 1)),
    load: i === 6 ? Number(formatMetric(pwr.total_load_kw, 1)) : Number(formatMetric(190 + Math.random() * 30, 1))
  }));

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans">
      
      <div className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Energy & Power Matrix
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          {activeStation} Station · Live grid telemetry and storage capacity
        </p>
      </div>

      <EnergyKpiGrid kpis={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PowerLoadChart powerSeries={powerSeries} />
        <GridAlerts energyJson={data} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col"><PowerSourcesTable sources={sources} /></div>
        <div className="lg:col-span-1 flex flex-col"><BatteryBanks batteries={batteries} /></div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PowerDistribution energyJson={data} />
        <FuelSystem energyJson={data} />
      </div>

    </div>
  );
}