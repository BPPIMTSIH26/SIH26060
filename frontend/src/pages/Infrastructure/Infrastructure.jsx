import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { infrastructureAPI } from "../../services/infrastructure";

import Skeleton from "../../components/context/Skeleton";

import KpiGrid from "./components/KpiGrid";
import PressureChart from "./components/PressureChart";
import AirlockList from "./components/AirlockList";
import HvacTable from "./components/HvacTable";
import ModuleDiagnostics from "./components/ModuleDiagnostics";
import MaintenancePanel from "./components/MaintenancePanel";
import { ShieldCheck, Snowflake, Activity, Fan } from "lucide-react";

// --- HELPER: Safely clamp floating point numbers ---
const formatMetric = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return Number(val).toFixed(decimals);
};

export default function Infrastructure() {
  const { activeStation = "Maitri" } = useOutletContext() || {};
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchInfra = async (isBackgroundRefresh = false) => {
      // Only show the skeleton loader on the very first load
      if (!isBackgroundRefresh) {
        setLoading(true);
      }
      setError(null);
      
      try {
        const res = await infrastructureAPI.getStationInfrastructure(activeStation, { 
          signal: abortController.signal 
        });
        
        if (abortController.signal.aborted) return;
        setData(res.data);
        
      } catch (err) {
        if (!abortController.signal.aborted && !isBackgroundRefresh) {
          setError(err.message || "Failed to fetch infrastructure data.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchInfra(false);

    const intervalId = setInterval(() => {
      fetchInfra(true);
    }, 30000);

    return () => { 
      clearInterval(intervalId);
      abortController.abort(); 
    };
  }, [activeStation]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans">
        <div className="mb-2 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

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

        <div className="rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[250px] flex flex-col">
          <div className="flex justify-between mb-6">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-full rounded-lg" />
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[300px]">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-32 hidden sm:block" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
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

      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-500 font-sans p-6 font-semibold">Error loading infrastructure data: {error}</div>;
  }

  // =========================================================================
  // DATA MAPPING
  // =========================================================================
  const kpis = [
    { label: "Overall Integrity", value: `${formatMetric(data.structural_health?.structural_integrity_percent, 1)}%`, status: "ok", icon: ShieldCheck },
    { label: "Roof Snow Load", value: `${formatMetric(data.structural_health?.snow_load_on_roof_kg, 0)} kg`, status: (data.structural_health?.snow_load_on_roof_kg ?? 0) > 20000 ? "warn" : "ok", icon: Snowflake },
    { label: "Living Qtrs Temp", value: `${formatMetric(data.modules?.living_quarters?.thermal_management?.indoor_temperature_c, 1)}°C`, status: "ok", icon: Activity },
    { label: "HVAC Efficiency", value: `${formatMetric(data.systems?.hvac_main?.operation?.efficiency_percent, 1)}%`, status: "ok", icon: Fan },
  ];

  const hvacSystems = [
    { 
      id: data.systems?.hvac_main?.system_id || "HVAC-01", 
      zone: "Living Quarters", 
      status: data.modules?.living_quarters?.status === "operational" ? "ok" : "warn", 
      rpm: Math.round((data.systems?.hvac_main?.performance?.air_circulation_cfm ?? 5500) / 5), 
      // Leave targets and currents as numbers here so the HvacTable can calculate warnings
      target: data.modules?.living_quarters?.thermal_management?.temperature_setpoint_c ?? 20, 
      current: data.modules?.living_quarters?.thermal_management?.indoor_temperature_c ?? 18 
    },
    { 
      id: "MOD-LAB", 
      zone: "Main Laboratory", 
      status: data.modules?.main_lab?.status === "operational" ? "ok" : "warn", 
      rpm: 1450, 
      target: data.modules?.main_lab?.thermal_management?.temperature_setpoint_c ?? 20, 
      current: data.modules?.main_lab?.thermal_management?.indoor_temperature_c ?? 19 
    },
    { 
      id: "MOD-STR", 
      zone: "Storage Module", 
      status: data.modules?.storage_module?.status === "operational" ? "ok" : "warn", 
      rpm: 1800, 
      target: data.modules?.storage_module?.thermal_management?.temperature_setpoint_c ?? -5, 
      current: data.modules?.storage_module?.thermal_management?.indoor_temperature_c ?? -5 
    },
  ];

  const pressureSeries = data.pressure_history || [];

  const airlocks = (data.airlocks || []).map(al => ({
    id: al.id,
    status: al.status,
    cycles: al.cycles,
    pressureDrop: `${formatMetric(al.pressureDrop_psi, 2)} psi` // Changed to 2 decimals max
  }));

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans">
      
      <div className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Structural Infrastructure
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          {activeStation} Station · Real-time physical layer diagnostics
        </p>
      </div>

      {/* 1. TOP KPI CARDS */}
      <KpiGrid kpis={kpis} />

      {/* 2. MIDDLE ROW: CHARTS & AIRLOCKS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PressureChart seriesData={pressureSeries} />
        <AirlockList airlocks={airlocks} />
      </div>

      {/* 3. HVAC MATRIX */}
      <HvacTable systems={hvacSystems} />

      {/* 4. NEW ROW: DIAGNOSTICS & MAINTENANCE */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2">
          <ModuleDiagnostics infraJson={data} />
        </div>
        <div className="col-span-1">
          <MaintenancePanel infraJson={data} />
        </div>
      </div>

    </div>
  );
}