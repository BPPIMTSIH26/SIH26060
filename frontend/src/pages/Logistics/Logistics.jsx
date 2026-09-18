import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { logisticsAPI } from "../../services/logistics";
import { Package, LayoutDashboard, ListTree } from "lucide-react";
import { animateOnScroll } from "../../scrollAnimation";
import Skeleton from "../../components/context/Skeleton";
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
  const [viewMode, setViewMode] = useState("overview"); // "overview" | "inventory"

  // Data fetching & polling
  useEffect(() => {
    let isMounted = true;
    const fetchLogistics = async () => {
      if (!data) setLoading(true);
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
    const intervalId = setInterval(fetchLogistics, 30000);
    return () => { 
      isMounted = false; 
      clearInterval(intervalId);
    };
  }, [activeStation]);

  // Trigger scroll animations after data paints
  useEffect(() => {
    if (data && !loading) {
      const timer = setTimeout(() => animateOnScroll(".scroll-box"), 50);
      return () => clearTimeout(timer);
    }
  }, [data, loading, viewMode]);

  // Comprehensive skeleton matching the exact dashboard layout
  if (loading && !data) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <Skeleton className="h-10 w-48 rounded-xl" />
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
          <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 flex flex-col min-h-[220px]">
            <div className="mb-4 flex items-baseline justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="flex-1 w-full rounded-lg" />
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 flex flex-col min-h-[220px]">
            <div className="mb-4 flex items-baseline justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex-1 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[68px] w-full rounded-xl" />)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 flex flex-col min-h-[300px]">
            <div className="mb-4 flex items-baseline justify-between">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="space-y-4 flex-1">
              <Skeleton className="h-6 w-full" />
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 flex flex-col min-h-[300px]">
            <div className="mb-4 flex items-baseline justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="flex-1 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[72px] w-full rounded-xl" />)}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40">
          <div className="mb-6 flex items-baseline justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <Skeleton className="h-3 w-32 mb-3" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-[76px] w-full rounded-xl" />)}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3 w-40 mb-1" />
              <Skeleton className="h-[46px] w-full rounded-xl" />
              <Skeleton className="h-[52px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex w-full p-6 text-red-500 font-sans font-semibold flex-col items-center">
        <h2 className="text-xl font-bold mb-2">Telemetry Lost</h2>
        <p>Failed to retrieve data: {error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-cyan-600 dark:text-cyan-500" />
            Logistics & Supply Chain
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {activeStation} Station · Resource tracking, shipments, and inventory
          </p>
        </div>
        <div className="flex bg-white/70 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md w-full sm:w-auto">
          <button 
            onClick={() => setViewMode("overview")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${viewMode === "overview" ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </button>
          <button 
            onClick={() => setViewMode("inventory")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${viewMode === "inventory" ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <ListTree className="w-4 h-4" /> Ledger
          </button>
        </div>
      </div>

      {viewMode === "overview" ? (
        <div className="flex flex-col gap-4 lg:gap-6 animate-in fade-in duration-300">
          <div className="scroll-box">
            <LogisticsKpiGrid logisticsJson={data} />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="scroll-box lg:col-span-2 flex flex-col">
              <FuelDepletionChart logisticsJson={data} />
            </div>
            <div className="scroll-box lg:col-span-1 flex flex-col">
              <FleetReadiness logisticsJson={data} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="scroll-box lg:col-span-2 flex flex-col">
              <InventoryTable logisticsJson={data} />
            </div>
            <div className="scroll-box lg:col-span-1 flex flex-col">
              <LogisticsForecast logisticsJson={data} />
            </div>
          </div>
          <div className="scroll-box">
            <PersonnelRoster logisticsJson={data} />
          </div>
        </div>
      ) : (
        <div className="scroll-box h-full min-h-[500px]">
          <InventoryTable logisticsJson={data} />
        </div>
      )}
    </div>
  );
}