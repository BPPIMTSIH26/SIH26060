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

export default function Energy() {
  const { activeStation = "Maitri" } = useOutletContext() || {};
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { pushAlert } = useGlobalAlert();

  useEffect(() => {
    let isMounted = true;
    const fetchEnergy = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await energyAPI.getStationEnergy(activeStation);
        if (isMounted) {
          const energyData = res.data;
          setData(energyData);

          // Automated Global Alert Push if Power Deficit is Active
          const deficit = energyData?.power_distribution?.net_power_deficit_kw ?? 0;
          if (deficit < 0) {
            pushAlert({
              alert_id: `AUTO-DEFICIT-${activeStation}`,
              severity: "CRITICAL",
              message: `⚠️ POWER DEFICIT: Generation (${energyData.power_distribution.total_generation_kw} kW) < Load (${energyData.power_distribution.total_load_kw} kW).`,
              affected_systems: ["energy", "battery_backup"],
              current_state: energyData.power_distribution,
              recommended_actions: ["Activate Generator 2", "Shed non-essential loads"]
            });
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEnergy();
    return () => { isMounted = false; };
  }, [activeStation, pushAlert]);

  // =========================================================================
  // OPTIMIZED SKELETON LOADER
  // =========================================================================
  if (loading) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950">
        <div className="mb-2 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 w-full"><Skeleton className="h-full w-full rounded-xl" /></div>)}
        </div>
        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 h-[300px]"><Skeleton className="h-full w-full rounded-xl" /></div>
          <div className="lg:col-span-1 h-[300px]"><Skeleton className="h-full w-full rounded-xl" /></div>
        </div>
        {/* Row 3 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 h-[300px]"><Skeleton className="h-full w-full rounded-xl" /></div>
          <div className="lg:col-span-1 h-[300px]"><Skeleton className="h-full w-full rounded-xl" /></div>
        </div>
        {/* Row 4 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-[250px]"><Skeleton className="h-full w-full rounded-xl" /></div>
          <div className="h-[250px]"><Skeleton className="h-full w-full rounded-xl" /></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-500 font-mono p-6">Error loading energy data: {error}</div>;
  }

  // =========================================================================
  // DATA MAPPING (100% JSON Utilization)
  // =========================================================================
  
  const pwr = data.power_distribution || {};
  const isDeficit = (pwr.net_power_deficit_kw ?? 0) < 0;

  const kpis = [
    { label: "System Health", value: `${data.system_health_score ?? 100}%`, subtext: `Trend: ${data.system_health_trend ?? 'stable'}`, status: (data.system_health_score ?? 100) > 80 ? "ok" : "warn", icon: Zap },
    { label: "Total Generation", value: `${pwr.total_generation_kw ?? 0} kW`, status: isDeficit ? "danger" : "ok", icon: Flame },
    { label: "Total Load", value: `${pwr.total_load_kw ?? 0} kW`, status: isDeficit ? "danger" : "ok", icon: ZapOff },
    { label: "Battery Status", value: `${data.battery_system?.current_charge_percent ?? 0}%`, status: (data.battery_system?.current_charge_percent ?? 0) > 30 ? "ok" : "danger", icon: Battery },
  ];

  // Map sources for table
  const sources = [
    { 
      id: data.generators?.gen_1?.generator_id || "GEN-001", 
      type: "Diesel Primary", 
      output: data.generators?.gen_1?.operation?.power_output_kw ?? 0, 
      maxOutput: data.generators?.gen_1?.thresholds?.power_output_max_kw ?? 250,
      efficiency: `${data.generators?.gen_1?.operation?.fuel_consumption_liters_per_hour ?? 0} L/h`, 
      status: data.generators?.gen_1?.status ?? "ACTIVE",
      runtime: data.generators?.gen_1?.operation?.runtime_total_hours ?? 0,
      maintDue: data.generators?.gen_1?.thresholds?.maintenance_due_hours ?? 0
    },
    { 
      id: data.generators?.gen_2?.generator_id || "GEN-002", 
      type: "Diesel Backup", 
      output: data.generators?.gen_2?.operation?.power_output_kw ?? 0, 
      maxOutput: data.generators?.gen_2?.thresholds?.power_output_max_kw ?? 250,
      efficiency: "Standby", 
      status: data.generators?.gen_2?.status ?? "STANDBY",
      runtime: data.generators?.gen_2?.operation?.runtime_total_hours ?? 0,
      maintDue: data.generators?.gen_2?.thresholds?.maintenance_due_hours ?? 0
    },
    { 
      id: data.renewable_energy?.solar_panels?.system_id || "SOLAR-001", 
      type: "Solar Array", 
      output: data.renewable_energy?.solar_panels?.current_output_kw ?? 0, 
      efficiency: "Weather Dep.", 
      status: data.renewable_energy?.solar_panels?.status?.toUpperCase() ?? "OPERATIONAL"
    },
  ];

  // Map battery
  const batteries = [{
    id: data.battery_system?.battery_bank_id || "BATT-01",
    charge: data.battery_system?.current_charge_percent ?? 0,
    status: isDeficit ? "warn" : "ok",
    infoLeft: isDeficit ? `Draining: ${data.battery_system?.performance?.discharging_rate_kw ?? 0} kW` : "Charging",
    infoRight: `Est. Backup: ${data.battery_system?.performance?.estimated_backup_hours_at_current_load ?? 0} hrs`,
    kwhText: `${data.battery_system?.current_charge_kwh ?? 0} / ${data.battery_system?.total_capacity_kwh ?? 0} kWh`,
    efficiency: data.battery_system?.performance?.efficiency_percent ?? 0,
    trend: data.battery_system?.charge_trend ?? "stable"
  }];

  // Generate mock past 24h series ending in current load/gen
  const powerSeries = Array.from({ length: 7 }).map((_, i) => ({
    time: `-${(6 - i) * 4}h`,
    gen: i === 6 ? (pwr.total_generation_kw ?? 200) : 200 + Math.random() * 20,
    load: i === 6 ? (pwr.total_load_kw ?? 180) : 190 + Math.random() * 30
  }));

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950">
      
      <div className="mb-2">
        <h1 className="font-mono text-2xl font-bold uppercase tracking-tight text-gray-900 dark:text-slate-100">
          Energy & Power Matrix
        </h1>
        <p className="font-mono text-sm text-gray-500 dark:text-slate-400 mt-1">
          {activeStation} Station · Live grid telemetry and storage capacity
        </p>
      </div>

      {/* Row 1: KPIs */}
      <EnergyKpiGrid kpis={kpis} />

      {/* Row 2: Charts & Critical Alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PowerLoadChart powerSeries={powerSeries} />
        <GridAlerts energyJson={data} />
      </div>

      {/* Row 3: Sources & Batteries */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col"><PowerSourcesTable sources={sources} /></div>
        <div className="lg:col-span-1 flex flex-col"><BatteryBanks batteries={batteries} /></div>
      </div>

      {/* Row 4: Power Distribution & Fuel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PowerDistribution energyJson={data} />
        <FuelSystem energyJson={data} />
      </div>

    </div>
  );
}