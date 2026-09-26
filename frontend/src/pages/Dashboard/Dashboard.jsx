/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Activity, ShieldCheck, Zap, Thermometer, Box, Droplet, Wind, Battery } from "lucide-react";
import { telemetryAPI } from "../../services/telemetryAPI";
import { logisticsAPI } from "../../services/logistics";
import { animateOnScroll } from "../../scrollAnimation";
import { StationOverview } from "./components/StationOverview";
import { PillarCards } from "./components/PillarCards";
import { TrendCharts } from "./components/TrendCharts";
import Skeleton from "../../components/context/Skeleton";

// Seed history generator for initial chart data
const generateSeedHistory = (station) => {
  const isMaitri = station === "Maitri";
  const baseGen = isMaitri ? 255.0 : 220.0;
  const baseLoad = isMaitri ? 245.5 : 160.0;
  const baseQTemp = 19.5;
  const baseLTemp = 19.0;
  const baseSTemp = -5.0;
  const baseFuel = isMaitri ? 76.5 : 83.3;

  return Array.from({ length: 7 }).map((_, i) => {
    const pastTime = new Date(Date.now() - (6 - i) * 30000);
    return {
      timestamp: pastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      energy: {
        power_distribution: {
          total_generation_kw: baseGen + (Math.random() - 0.5) * 5,
          total_load_kw: baseLoad + (Math.random() - 0.5) * 10
        }
      },
      infra: {
        modules: {
          living_quarters: { thermal_management: { indoor_temperature_c: baseQTemp + (Math.random() - 0.5) * 0.5 } },
          main_lab: { thermal_management: { indoor_temperature_c: baseLTemp + (Math.random() - 0.5) * 0.5 } },
          storage_module: { thermal_management: { indoor_temperature_c: baseSTemp + (Math.random() - 0.5) * 0.2 } }
        }
      },
      logistics: {
        fuel_reserves: {
          primary_tank: { current_level_percent: baseFuel + ((6 - i) * 0.05) },
          reserve_status_percent: 100
        }
      }
    };
  });
};

export default function Dashboard() {
  const { activeStation = "Maitri" } = useOutletContext() || {};
  const [dashboardData, setDashboardData] = useState(null);

  // Initialize history with seed data for the active station
  const [history, setHistory] = useState(() => generateSeedHistory(activeStation));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch telemetry and logistics data on mount and every 30 seconds
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    // Reset history and dashboard data when station changes
    setHistory(generateSeedHistory(activeStation));
    setDashboardData(null);

    const fetchAllData = async (isBackgroundRefresh = false) => {
      if (!isBackgroundRefresh) setLoading(true);
      setError(null);

      try {
        const results = await Promise.allSettled([
          telemetryAPI.getLiveTelemetry(activeStation, { signal }),
          logisticsAPI.getStationLogistics(activeStation, { signal })
        ]);

        if (signal.aborted) return;

        const telemetryRes = results[0].status === 'fulfilled' ? results[0].value.data : null;
        const logRes = results[1].status === 'fulfilled' ? results[1].value.data : null;

        if (!telemetryRes && !logRes) throw new Error("Critical Failure: All station systems are offline.");

        const currentTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const currentSnapshot = {
          infra: telemetryRes?.infrastructure,
          energy: telemetryRes?.energy,
          env: telemetryRes?.environment,
          logistics: logRes,
          timestamp: currentTimestamp
        };

        setDashboardData(currentSnapshot);

        // Append to true rolling history (cap at 7 points for a clean sliding window chart)
        setHistory(prev => {
          const updated = [...prev, currentSnapshot];
          return updated.length > 7 ? updated.slice(updated.length - 7) : updated;
        });

      } catch (err) {
        if (!signal.aborted && !isBackgroundRefresh) setError(err.message || "Failed to synchronize station telemetry.");
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchAllData(false);
    const intervalId = setInterval(() => fetchAllData(true), 30000); // 30s live polling

    return () => {
      clearInterval(intervalId);
      abortController.abort();
    };
  }, [activeStation]);

  // Trigger scroll animations after data paints
  useEffect(() => {
    if (dashboardData && !loading) {
      const timer = setTimeout(() => animateOnScroll(".scroll-box"), 50);
      return () => clearTimeout(timer);
    }
  }, [dashboardData, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-slate-950 font-sans">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <div className="h-[530px] w-full"><Skeleton className="h-full w-full rounded-xl" /></div>
            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="h-[250px] w-full"><Skeleton className="h-full w-full rounded-xl" /></div>
              <div className="h-[256px] w-full"><Skeleton className="h-full w-full rounded-xl" /></div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-[130px] w-full"><Skeleton className="h-full w-full rounded-xl" /></div>)}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-[300px] w-full"><Skeleton className="h-full w-full rounded-xl" /></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return <div className="text-red-500 font-mono p-6">Error: {error}</div>;
  }

  const { infra, energy, env, logistics } = dashboardData;

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

  const allAlerts = [
    ...(infra?.alerts_local || []),
    ...(energy?.interconnections?.critical_alert && energy.interconnections.critical_alert !== "NONE" ? [{ severity: energy.interconnections.severity.toLowerCase(), message: energy.interconnections.alert_description }] : []),
    ...(env?.alerts_local || []),
    ...(logistics?.alerts_local || [])
  ];

  const isPowerDeficit = energy?.power_distribution?.net_power_deficit_kw < 0;
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
        { label: "Food", value: `${Number(logistics?.supplies?.food?.current_stock_days || 0).toFixed(0)} Days`, icon: Box },
        { label: "Fuel Res.", value: `${Number(logistics?.fuel_reserves?.reserve_status_percent || 0).toFixed(0)}%`, icon: Droplet }
      ]
    }
  ];

  // Map the genuine rolling history state directly to the charts
  const powerSeries = history.map(snap => ({
    t: snap.timestamp,
    generation: Number((snap.energy?.power_distribution?.total_generation_kw || 0).toFixed(1)),
    load: Number((snap.energy?.power_distribution?.total_load_kw || 0).toFixed(1))
  }));

  const tempSeries = history.map(snap => ({
    day: snap.timestamp,
    quarters: Number((snap.infra?.modules?.living_quarters?.thermal_management?.indoor_temperature_c || 0).toFixed(1)),
    lab: Number((snap.infra?.modules?.main_lab?.thermal_management?.indoor_temperature_c || 0).toFixed(1)),
    storage: Number((snap.infra?.modules?.storage_module?.thermal_management?.indoor_temperature_c || 0).toFixed(1))
  }));

  const fuelSeries = history.map(snap => ({
    t: snap.timestamp,
    primary: Number((snap.logistics?.fuel_reserves?.primary_tank?.current_level_percent || 0).toFixed(1)),
    reserve: Number((snap.logistics?.fuel_reserves?.reserve_status_percent || 0).toFixed(1))
  }));

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-slate-950 text-slate-50 font-sans">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6">

        <div className="scroll-box">
          <StationOverview
            activeStation={activeStation}
            // FIX: Map entries to keep the key as an 'id' or 'name' so the 3D model knows what is what
            modules={Object.entries(infra?.modules || {}).map(([key, value]) => ({
              id: key,
              ...value
            }))}
            health={dynamicHealth}
            alerts={allAlerts}
            environment={{
              windDirection: env?.exterior_conditions?.wind?.wind_direction,
              windSpeed: env?.exterior_conditions?.wind?.wind_speed_kmh,
              outsideTemp: env?.exterior_conditions?.temperature?.outside_temperature_c
            }}
          />

        </div>

        <div className="scroll-box">
          <PillarCards pillars={pillars} />
        </div>

        <div className="scroll-box">
          <TrendCharts
            powerSeries={powerSeries}
            tempSeries={tempSeries}
            fuelSeries={fuelSeries}
          />
        </div>

      </div>
    </div>
  );
}