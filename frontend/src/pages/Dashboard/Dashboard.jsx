/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Activity, ShieldCheck, Zap, Thermometer, Box, Droplet, Wind, Battery } from "lucide-react";

// Optimized Imports: Only 2 API calls now!
import { telemetryAPI } from "../../services/telemetryAPI";
import { logisticsAPI } from "../../services/logistics"; // adjust path if you renamed it to logisticsAPI.js

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
    // 1. Initialize AbortController for network cancellation
    const abortController = new AbortController();
    const signal = abortController.signal;

    // Added a parameter: isBackgroundRefresh
    const fetchAllData = async (isBackgroundRefresh = false) => {
      // Only show skeleton loaders on the very first load
      if (!isBackgroundRefresh) {
        setLoading(true);
      }
      setError(null);
      
      try {
        const results = await Promise.allSettled([
          telemetryAPI.getLiveTelemetry(activeStation, { signal }),
          logisticsAPI.getStationLogistics(activeStation, { signal })
        ]);

        if (signal.aborted) return;

        const telemetryRes = results[0].status === 'fulfilled' ? results[0].value.data : null;
        const logRes = results[1].status === 'fulfilled' ? results[1].value.data : null;

        if (!telemetryRes && !logRes) {
          throw new Error("Critical Failure: All station systems are offline.");
        }

        setDashboardData({
          infra: telemetryRes?.infrastructure,
          energy: telemetryRes?.energy,
          env: telemetryRes?.environment,
          logistics: logRes
        });

      } catch (err) {
        if (!signal.aborted && !isBackgroundRefresh) {
          setError(err.message || "Failed to synchronize station telemetry.");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    // 1. Fetch immediately on page load (shows skeletons)
    fetchAllData(false);

    // 2. Set up the 30-second background loop (NO skeletons)
    const intervalId = setInterval(() => {
      fetchAllData(true);
    }, 30000); // 30000 ms = 30 seconds

    // 3. Cleanup function strictly clears the timer and aborts pending requests
    return () => { 
      clearInterval(intervalId);
      abortController.abort(); 
    };
  }, [activeStation]);

  // =========================================================================
  // PERFECTLY STRUCTURED SKELETON LOADER
  // =========================================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-slate-950 font-sans">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6">
          
          {/* 1. Station Overview Skeleton */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <div className="h-[530px] w-full">
                <Skeleton className="h-full w-full rounded-xl" />
            </div>
            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="h-[250px] w-full"><Skeleton className="h-full w-full rounded-xl" /></div>
              <div className="h-[256px] w-full"><Skeleton className="h-full w-full rounded-xl" /></div>
            </div>
          </div>

          {/* 2. Pillar Cards Skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[130px] w-full">
                    <Skeleton className="h-full w-full rounded-xl" />
                </div>
            ))}
          </div>

          {/* 3. Trend Charts Skeleton */}
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
  // =========================================================================
  const calculateStationHealth = () => {
    let infraScore = infra?.system_health_score ?? 100;
    let energyScore = energy?.system_health_score ?? 100;
    let envScore = env?.system_health_score ?? 100;
    let logScore = logistics?.system_health_score ?? 100;

    if (energy?.power_distribution?.net_power_deficit_kw < 0) energyScore -= 15;
    if (energy?.battery_system?.current_charge_percent < 30) energyScore -= 10;
    if (env?.exterior_conditions?.temperature?.alerts?.is_warning_cold) envScore -= 5;
    if (env?.exterior_conditions?.wind?.alerts?.is_warning_wind) envScore -= 5;
    if (infra?.structural_health?.snow_load_on_roof_kg > 20000) infraScore -= 10;
    if (logistics?.supplies?.food?.current_stock_days < 30) logScore -= 10;

    const clamp = (val) => Math.max(0, Math.min(100, val));
    const cInfra = clamp(infraScore);
    const cEnergy = clamp(energyScore);
    const cEnv = clamp(envScore);
    const cLog = clamp(logScore);
    
    const finalScore = Math.round((cInfra + cEnergy + cEnv + cLog) / 4);

    let trend = "stable";
    if (finalScore < 75) trend = "deteriorating";
    else if (finalScore > 90) trend = "improving";

    const breakdown = [
      { label: "Energy", value: cEnergy, status: cEnergy > 80 ? "ok" : cEnergy > 50 ? "warn" : "danger" },
      { label: "Infra", value: cInfra, status: cInfra > 80 ? "ok" : cInfra > 50 ? "warn" : "danger" },
      { label: "Climate", value: cEnv, status: cEnv > 80 ? "ok" : cEnv > 50 ? "warn" : "danger" },
      { label: "Logistics", value: cLog, status: cLog > 80 ? "ok" : cLog > 50 ? "warn" : "danger" }
    ];

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
  
  // Helper to ensure numbers don't crash if undefined
  const formatMetric = (val) => Number(val || 0).toFixed(1);

  const pillars = [
    {
      id: "infra",
      title: "Infrastructure",
      status: infra?.system_health_score > 90 ? "ok" : "warn",
      icon: ShieldCheck,
      link: "/infrastructure",
      metrics: [
        { label: "Integrity", value: `${formatMetric(infra?.structural_health?.structural_integrity_percent)}%`, icon: Activity },
        // Snow load is in thousands, so we divide by 1000 then format to 1 decimal
        { label: "Snow Load", value: `${formatMetric((infra?.structural_health?.snow_load_on_roof_kg ?? 0) / 1000)}t`, icon: Box }
      ]
    },
    {
      id: "energy",
      title: "Energy Grid",
      status: isPowerDeficit ? "danger" : "ok",
      icon: Zap,
      link: "/energypower",
      metrics: [
        { label: "Load", value: `${formatMetric(energy?.power_distribution?.total_load_kw)} kW`, icon: Zap },
        { label: "Battery", value: `${formatMetric(energy?.battery_system?.current_charge_percent)}%`, icon: Battery }
      ]
    },
    {
      id: "env",
      title: "Environment",
      status: env?.exterior_conditions?.temperature?.alerts?.is_warning_cold ? "warn" : "ok",
      icon: Thermometer,
      link: "/environment",
      metrics: [
        { label: "Ext Temp", value: `${formatMetric(env?.exterior_conditions?.temperature?.outside_temperature_c)}°C`, icon: Thermometer },
        { label: "Wind", value: `${formatMetric(env?.exterior_conditions?.wind?.wind_speed_kmh)} km/h`, icon: Wind }
      ]
    },
    {
      id: "logistics",
      title: "Logistics",
      status: logistics?.supplies?.food?.status === "adequate" ? "ok" : "warn",
      icon: Box,
      link: "/logistics",
      metrics: [
        // Days and Percentages usually look better as whole numbers, so we use toFixed(0) here
        { label: "Food", value: `${Number(logistics?.supplies?.food?.current_stock_days || 0).toFixed(0)} Days`, icon: Box },
        { label: "Fuel Res.", value: `${Number(logistics?.fuel_reserves?.reserve_status_percent || 0).toFixed(0)}%`, icon: Droplet }
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