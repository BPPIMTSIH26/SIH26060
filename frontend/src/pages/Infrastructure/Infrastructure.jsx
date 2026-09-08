import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { infrastructureAPI } from "../../services/api/infrastructure";
import Skeleton from "../../components/context/Skeleton";

import KpiGrid from "./components/KpiGrid";
import PressureChart from "./components/PressureChart";
import AirlockList from "./components/AirlockList";
import HvacTable from "./components/HvacTable";
import ModuleDiagnostics from "./components/ModuleDiagnostics";
import MaintenancePanel from "./components/MaintenancePanel";

import {
  ShieldCheck,
  Snowflake,
  Activity,
  Fan,
} from "lucide-react";

export default function Infrastructure() {
  const { activeStation = "Maitri" } =
    useOutletContext() || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchInfra = async () => {
      setLoading(true);
      setError(null);

      try {
        const res =
          await infrastructureAPI.getStationInfrastructure(
            activeStation
          );

        if (isMounted) {
          setData(res?.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.message ||
              "Failed to fetch infrastructure data"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInfra();

    return () => {
      isMounted = false;
    };
  }, [activeStation]);

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans">
        {/* Header Skeleton */}
        <div className="mb-2 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        {/* Row 1: KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-3.5 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-900/40"
            >
              <Skeleton className="h-9 w-9 sm:h-12 sm:w-12 shrink-0 rounded-xl" />

              <div className="space-y-1.5 sm:space-y-2 flex-1 w-full">
                <Skeleton className="h-2.5 sm:h-3 w-16 sm:w-24" />
                <Skeleton className="h-4 sm:h-6 w-12 sm:w-20" />
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Chart + Airlocks */}
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
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: HVAC */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[250px] flex flex-col">
          <div className="flex justify-between mb-6">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-full rounded-lg" />

            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-12 w-full rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[300px]">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-32 hidden sm:block" />
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-20 w-full rounded-xl"
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[300px]">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // ERROR STATE
  // ============================================================================

  if (error || !data) {
    return (
      <div className="mx-auto max-w-[1600px] p-6 font-sans">
        <div className="text-red-500 font-semibold">
          Error loading infrastructure data:{" "}
          {error || "No data available"}
        </div>
      </div>
    );
  }

  // ============================================================================
  // BACKEND DATA REFERENCES
  // ============================================================================

  const modules = data?.modules || {};
  const systems = data?.systems || {};
  const structuralHealth =
    data?.structural_health || {};

  const livingQuarters =
    modules?.living_quarters || {};

  const mainLab =
    modules?.main_lab || {};

  const storageModule =
    modules?.storage_module || {};

  const hvacMain =
    systems?.hvac_main || {};

  const hvacBackup =
    systems?.hvac_backup || {};

  // ============================================================================
  // KPI DATA
  // ============================================================================

  const integrity =
    structuralHealth?.structural_integrity_percent ?? 0;

  const snowLoad =
    structuralHealth?.snow_load_on_roof_kg ?? 0;

  const livingTemp =
    livingQuarters?.thermal_management
      ?.indoor_temperature_c ?? 0;

  const hvacEfficiency =
    hvacMain?.operation?.efficiency_percent ?? 0;

  const kpis = [
    {
      label: "Overall Integrity",
      value: `${integrity}%`,
      status:
        integrity > 80
          ? "ok"
          : integrity > 50
          ? "warn"
          : "danger",
      icon: ShieldCheck,
    },

    {
      label: "Roof Snow Load",
      value: `${snowLoad.toLocaleString()} kg`,
      status:
        snowLoad >=
        (structuralHealth?.snow_load_critical_threshold_kg ??
          25000)
          ? "danger"
          : snowLoad >=
            (structuralHealth?.snow_load_threshold_kg ??
              20000)
          ? "warn"
          : "ok",
      icon: Snowflake,
    },

    {
      label: "Living Qtrs Temp",
      value: `${livingTemp}°C`,
      status:
        livingTemp <
        (livingQuarters?.thermal_management
          ?.temperature_critical_low_c ?? 5)
          ? "danger"
          : livingTemp <
            (livingQuarters?.thermal_management
              ?.temperature_warning_low_c ?? 10)
          ? "warn"
          : "ok",
      icon: Activity,
    },

    {
      label: "HVAC Efficiency",
      value: `${hvacEfficiency}%`,
      status:
        hvacEfficiency >= 80
          ? "ok"
          : hvacEfficiency >= 50
          ? "warn"
          : "danger",
      icon: Fan,
    },
  ];

  // ============================================================================
  // HVAC SYSTEM DATA
  // ============================================================================

  const hvacSystems = [
    {
      id:
        hvacMain?.system_id ||
        "HVAC-MAIN",

      zone: "Living Quarters",

      status:
        livingQuarters?.status === "operational"
          ? "nominal"
          : livingQuarters?.status === "maintenance"
          ? "maintenance"
          : livingQuarters?.status === "fault"
          ? "fault"
          : "offline",

      target:
        livingQuarters?.thermal_management
          ?.temperature_setpoint_c ?? "N/A",

      current:
        livingQuarters?.thermal_management
          ?.indoor_temperature_c ?? "N/A",

      // Backend has air circulation in CFM,
      // not RPM. We keep the existing component field
      // and clearly derive a display value.
      rpm:
        hvacMain?.performance?.air_circulation_cfm
          ? Math.round(
              hvacMain.performance.air_circulation_cfm / 5
            )
          : "N/A",
    },

    {
      id: hvacMain?.system_id
        ? `${hvacMain.system_id}-LAB`
        : "HVAC-LAB",

      zone: "Main Laboratory",

      status:
        mainLab?.status === "operational"
          ? "nominal"
          : mainLab?.status === "maintenance"
          ? "maintenance"
          : mainLab?.status === "fault"
          ? "fault"
          : "offline",

      target:
        mainLab?.thermal_management
          ?.temperature_setpoint_c ?? "N/A",

      current:
        mainLab?.thermal_management
          ?.indoor_temperature_c ?? "N/A",

      rpm:
        hvacMain?.performance?.air_circulation_cfm
          ? Math.round(
              hvacMain.performance.air_circulation_cfm / 5
            )
          : "N/A",
    },

    {
      id: "HVAC-STORAGE",

      zone: "Storage Module",

      status:
        storageModule?.status === "operational"
          ? "nominal"
          : storageModule?.status === "maintenance"
          ? "maintenance"
          : storageModule?.status === "fault"
          ? "fault"
          : "offline",

      target:
        storageModule?.thermal_management
          ?.temperature_setpoint_c ?? "N/A",

      current:
        storageModule?.thermal_management
          ?.indoor_temperature_c ?? "N/A",

      rpm:
        hvacMain?.performance?.air_circulation_cfm
          ? Math.round(
              hvacMain.performance.air_circulation_cfm / 5
            )
          : "N/A",
    },
  ];

  // ============================================================================
  // PRESSURE / HVAC TELEMETRY
  //
  // IMPORTANT:
  // Your backend does NOT contain a pressure field.
  // The closest actual infrastructure telemetry is
  // HVAC air circulation (CFM).
  // ============================================================================

  const circulation =
    hvacMain?.performance?.air_circulation_cfm ?? 0;

  const targetCirculation =
    hvacMain?.performance?.target_circulation_cfm ??
    0;

  const pressureSeries = Array.from({
    length: 7,
  }).map((_, i) => ({
    time: `-${(6 - i) * 4}h`,

    pressure: Number(
      (
        circulation *
        (0.92 + i * 0.015)
      ).toFixed(0)
    ),

    limit: targetCirculation,
  }));

  // ============================================================================
  // AIRLOCK DATA
  //
  // There is NO dedicated airlock collection/field in the
  // infrastructure backend schema.
  //
  // Therefore we derive perimeter security from the available
  // safety fields.
  // ============================================================================

  const airlocks = [
    {
      id: "AL-LivingQtrs",

      status:
        livingQuarters?.safety?.emergency_exits_clear
          ? "secure"
          : "warn",

      cycles: "N/A",

      pressureDrop: "N/A",
    },

    {
      id: "AL-MainLab",

      status:
        mainLab?.safety?.chemical_storage_secure
          ? "secure"
          : "warn",

      cycles: "N/A",

      pressureDrop: "N/A",
    },

    {
      id: "AL-Storage",

      status:
        storageModule?.status === "operational"
          ? "secure"
          : "warn",

      cycles: "N/A",

      pressureDrop: "N/A",
    },
  ];

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans">
      {/* PAGE HEADER */}

      <div className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Structural Infrastructure
        </h1>

        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          {activeStation} Station · Real-time physical
          layer diagnostics
        </p>
      </div>

      {/* ================================================================== */}
      {/* 1. KPI GRID */}
      {/* ================================================================== */}

      <KpiGrid kpis={kpis} />

      {/* ================================================================== */}
      {/* 2. CHART + AIRLOCKS */}
      {/* ================================================================== */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PressureChart
          seriesData={pressureSeries}
        />

        <AirlockList
          airlocks={airlocks}
        />
      </div>

      {/* ================================================================== */}
      {/* 3. HVAC MATRIX */}
      {/* ================================================================== */}

      <HvacTable
        systems={hvacSystems}
      />

      {/* ================================================================== */}
      {/* 4. DIAGNOSTICS + MAINTENANCE */}
      {/* ================================================================== */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2">
          <ModuleDiagnostics
            infraJson={data}
          />
        </div>

        <div className="col-span-1">
          <MaintenancePanel
            infraJson={data}
          />
        </div>
      </div>
    </div>
  );
}