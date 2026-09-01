import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { logisticsAPI } from "../../services/logistics";

// Global Skeleton Component
import Skeleton from "../../components/context/Skeleton";

// Component imports
import LogisticsKpiGrid from "./components/LogisticsKpiGrid";
import FuelDepletionChart from "./components/FuelDepletionChart";
import FleetReadiness from "./components/FleetReadiness";
import InventoryTable from "./components/InventoryTable";
import LogisticsForecast from "./components/LogisticsForecast";
import PersonnelRoster from "./components/PersonnelRoster";

export default function Logistics() {
  const { activeStation = "Maitri" } = useOutletContext() || {};
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLogistics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await logisticsAPI.getStationLogistics(activeStation);
        if (isMounted) setData(res.data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchLogistics();
    return () => { isMounted = false; };
  }, [activeStation]);

  // =========================================================================
  // SKELETON LOADING STATE (Corrected layout)
  // =========================================================================
  if (loading) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950">
        
        {/* Skeleton Header */}
        <div className="mb-2 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        {/* Row 1: Skeleton KPI Grid (4 Cards) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-50/60 dark:bg-slate-900/60 p-5 shadow-sm">
              <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Charts & Fleet Skeleton */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Chart Skeleton */}
          <div className="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-50/60 dark:bg-slate-900/40 p-5 flex flex-col min-h-[300px]">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-48 hidden sm:block" />
            </div>
            <Skeleton className="flex-1 w-full rounded-md" />
          </div>

          {/* Fleet Readiness Skeleton */}
          <div className="col-span-1 rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-50/60 dark:bg-slate-900/40 p-5 flex flex-col min-h-[300px]">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Inventory Table & Forecast Skeleton */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Inventory Table Skeleton */}
          <div className="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-50/60 dark:bg-slate-900/40 p-5 min-h-[300px]">
            <div className="flex justify-between mb-6">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>

          {/* Forecast Skeleton */}
          <div className="col-span-1 rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-50/60 dark:bg-slate-900/40 p-5 flex flex-col min-h-[300px]">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Personnel Roster Skeleton */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-50/60 dark:bg-slate-900/40 p-5 min-h-[250px] flex flex-col">
          <div className="mb-6 flex justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
            <div className="sm:col-span-2 space-y-3">
              <Skeleton className="h-3 w-32 mb-3" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-3 w-32 mb-1" />
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // =========================================================================
  // ERROR STATE
  // =========================================================================
  if (error || !data) {
    return (
      <div className="flex w-full p-6 text-red-500 font-mono flex-col items-center">
        <h2 className="text-xl font-bold mb-2">Telemetry Lost</h2>
        <p>Failed to retrieve data: {error}</p>
      </div>
    );
  }

  // =========================================================================
  // SUCCESS / RENDER STATE
  // =========================================================================
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950">
      
      {/* PAGE HEADER */}
      <div className="mb-2">
        <h1 className="font-mono text-2xl font-bold uppercase tracking-tight text-gray-900 dark:text-slate-100">
          Logistics & Supply Chain
        </h1>
        <p className="font-mono text-sm text-gray-500 dark:text-slate-400 mt-1">
          {activeStation} Station · Resource tracking, shipments, and inventory
        </p>
      </div>

      <LogisticsKpiGrid logisticsJson={data} />

      {/* Row 2: Fuel Chart and Shipments */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FuelDepletionChart logisticsJson={data} />
        <FleetReadiness logisticsJson={data} />
      </div>

      {/* Row 3: Inventory Table and Risk Forecast */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InventoryTable logisticsJson={data} />
        </div>
        <div className="lg:col-span-1">
          <LogisticsForecast logisticsJson={data} />
        </div>
      </div>

      {/* Row 4: Personnel Manifest */}
      <PersonnelRoster logisticsJson={data} />

    </div>
  );
}