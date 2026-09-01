/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Activity, ShieldCheck, Zap, Thermometer, Box, Droplet, Wind, Battery } from "lucide-react";

import { infrastructureAPI } from "../../services/infrastructure";
import { energyAPI } from "../../services/energy";
import { environmentAPI } from "../../services/environment";
import { logisticsAPI } from "../../services/logistics";

import { StationOverview } from "./components/StationOverview";
import { PillarCards } from "./components/PillarCards";
import { TrendCharts } from "./components/TrendCharts";
import Skeleton from "../../components/context/Skeleton";

export default function Dashboard() {
  const { activeStation = "Maitri" } = useOutletContext() || {};
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [infraRes, energyRes, envRes, logRes] = await Promise.all([
          infrastructureAPI.getStationInfrastructure(activeStation),
          energyAPI.getStationEnergy(activeStation),
          environmentAPI.getStationEnvironment(activeStation),
          logisticsAPI.getStationLogistics(activeStation)
        ]);

        if (isMounted) {
          setDashboardData({
            infra: infraRes.data,
            energy: energyRes.data,
            env: envRes.data,
            logistics: logRes.data
          });
        }
      } catch (err) {
        if (isMounted) setError("Failed to synchronize station telemetry.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllData();
    return () => { isMounted = false; };
  }, [activeStation]);

  // =========================================================================
  // PERFECTLY STRUCTURED SKELETON LOADER
  // Mirrors the exact grid and heights of the real dashboard components
  // =========================================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-slate-950 font-sans">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6">
          
          {/* 1. Station Overview Skeleton (Map on left, Gauge + Alerts on right) */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <div className="h-[530px] w-full">
                <Skeleton className="h-full w-full rounded-xl" />
            </div>
            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="h-[250px] w-full"><Skeleton className="h-full w-full rounded-xl" /></div>
              <div className="h-[256px] w-full"><Skeleton className="h-full w-full rounded-xl" /></div>
            </div>
          </div>

          {/* 2. Pillar Cards Skeleton (4 metrics) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[130px] w-full">
                    <Skeleton className="h-full w-full rounded-xl" />
                </div>
            ))}
          </div>

          {/* 3. Trend Charts Skeleton (3 charts) */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-[300px] w-full">
                    <Skeleton className="h-full w-full rounded-xl" />
                </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return <div className="text-red-500 font-mono p-6">Error: {error}</div>;
  }

  const { infra, energy, env, logistics } = dashboardData;

  // =========================================================================
  // DYNAMIC HEALTH ENGINE
  // Calculates real-time health based on live telemetry anomalies
  // =========================================================================
  const calculateStationHealth = () => {
    // Start with base scores
    let infraScore = infra?.system_health_score ?? 100;
    let energyScore = energy?.system_health_score ?? 100;
    let envScore = env?.system_health_score ?? 100;
    let logScore = logistics?.system_health_score ?? 100;

    // Apply Live Penalties based on JSON Schema
    if (energy?.power_distribution?.net_power_deficit_kw < 0) energyScore -= 15;
    if (energy?.battery_system?.current_charge_percent < 30) energyScore -= 10;
    if (env?.exterior_conditions?.temperature?.alerts?.is_warning_cold) envScore -= 5;
    if (env?.exterior_conditions?.wind?.alerts?.is_warning_wind) envScore -= 5;
    if (infra?.structural_health?.snow_load_on_roof_kg > 20000) infraScore -= 10;
    if (logistics?.supplies?.food?.current_stock_days < 30) logScore -= 10;

    // Clamp scores between 0 and 100 so bars don't overflow
    const clamp = (val) => Math.max(0, Math.min(100, val));
    const cInfra = clamp(infraScore);
    const cEnergy = clamp(energyScore);
    const cEnv = clamp(envScore);
    const cLog = clamp(logScore);
    
    // Final aggregate score
    const finalScore = Math.round((cInfra + cEnergy + cEnv + cLog) / 4);

    // Determine overall trend
    let trend = "stable";
    if (finalScore < 75) trend = "deteriorating";
    else if (finalScore > 90) trend = "improving";

    // Generate the breakdown array for the progress bars
    const breakdown = [
      { label: "Energy", value: cEnergy, status: cEnergy > 80 ? "ok" : cEnergy > 50 ? "warn" : "danger" },
      { label: "Infra", value: cInfra, status: cInfra > 80 ? "ok" : cInfra > 50 ? "warn" : "danger" },
      { label: "Climate", value: cEnv, status: cEnv > 80 ? "ok" : cEnv > 50 ? "warn" : "danger" },
      { label: "Logistics", value: cLog, status: cLog > 80 ? "ok" : cLog > 50 ? "warn" : "danger" }
    ];

    // Return the full object, now including the breakdown!
    return { value: finalScore, score: finalScore, trend, breakdown };
  };

  const dynamicHealth = calculateStationHealth();

  // =========================================================================
  // DASHBOARD DATA AGGREGATION
  // =========================================================================
  
  const allAlerts = [
    ...(infra?.alerts_local || []),
    ...(energy?.interconnections?.critical_alert ? [{ severity: energy.interconnections.severity.toLowerCase(), message: energy.interconnections.alert_description }] : []),
    ...(env?.alerts_local || []),
    ...(logistics?.alerts_local || [])
  ];

  const isPowerDeficit = energy?.power_distribution?.net_power_deficit_kw < 0;
  
  const pillars = [
    {
      id: "infra",
      title: "Infrastructure",
      status: infra?.system_health_score > 90 ? "ok" : "warn",
      icon: ShieldCheck,
      link: "/infrastructure",
      metrics: [
        { label: "Integrity", value: `${infra?.structural_health?.structural_integrity_percent ?? 0}%`, icon: Activity },
        { label: "Snow Load", value: `${((infra?.structural_health?.snow_load_on_roof_kg ?? 0) / 1000).toFixed(1)}t`, icon: Box }
      ]
    },
    {
      id: "energy",
      title: "Energy Grid",
      status: isPowerDeficit ? "danger" : "ok",
      icon: Zap,
      link: "/energypower",
      metrics: [
        { label: "Load", value: `${energy?.power_distribution?.total_load_kw ?? 0} kW`, icon: Zap },
        { label: "Battery", value: `${energy?.battery_system?.current_charge_percent ?? 0}%`, icon: Battery }
      ]
    },
    {
      id: "env",
      title: "Environment",
      status: env?.exterior_conditions?.temperature?.alerts?.is_warning_cold ? "warn" : "ok",
      icon: Thermometer,
      link: "/environment",
      metrics: [
        { label: "Ext Temp", value: `${env?.exterior_conditions?.temperature?.outside_temperature_c ?? 0}°C`, icon: Thermometer },
        { label: "Wind", value: `${env?.exterior_conditions?.wind?.wind_speed_kmh ?? 0} km/h`, icon: Wind }
      ]
    },
    {
      id: "logistics",
      title: "Logistics",
      status: logistics?.supplies?.food?.status === "adequate" ? "ok" : "warn",
      icon: Box,
      link: "/logistics",
      metrics: [
        { label: "Food", value: `${logistics?.supplies?.food?.current_stock_days ?? 0} Days`, icon: Box },
        { label: "Fuel Res.", value: `${logistics?.fuel_reserves?.reserve_status_percent ?? 0}%`, icon: Droplet }
      ]
    }
  ];

  const powerSeries = Array.from({ length: 7 }).map((_, i) => ({
    t: `-${(6 - i) * 4}h`,
    generation: energy?.power_distribution?.total_generation_kw || 200,
    load: energy?.power_distribution?.total_load_kw || 180
  }));

  const tempSeries = Array.from({ length: 7 }).map((_, i) => ({
    day: `Day ${i+1}`,
    quarters: infra?.modules?.living_quarters?.thermal_management?.indoor_temperature_c || 20,
    lab: infra?.modules?.main_lab?.thermal_management?.indoor_temperature_c || 19,
    storage: infra?.modules?.storage_module?.thermal_management?.indoor_temperature_c || -5
  }));

  const fuelSeries = Array.from({ length: 7 }).map((_, i) => ({
    t: `-${(6 - i) * 12}h`,
    primary: logistics?.fuel_reserves?.reserve_status_percent || 80,
    reserve: 100
  }));

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-slate-950 text-slate-50 font-sans">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6">
        
        <StationOverview 
          activeStation={activeStation} 
          modules={Object.values(infra?.modules || {})}
          health={dynamicHealth}
          alerts={allAlerts}
          environment={{
            windDirection: env?.exterior_conditions?.wind?.wind_direction,
            windSpeed: env?.exterior_conditions?.wind?.wind_speed_kmh,
            outsideTemp: env?.exterior_conditions?.temperature?.outside_temperature_c
          }}
        />
        
        <PillarCards pillars={pillars} />
        
        <TrendCharts 
          powerSeries={powerSeries} 
          tempSeries={tempSeries} 
          fuelSeries={fuelSeries} 
        />
        
      </div>
    </div>
  );
}