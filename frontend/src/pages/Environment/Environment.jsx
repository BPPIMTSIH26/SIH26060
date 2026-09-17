import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { environmentAPI } from "../../services/environment";
import { Thermometer, Wind, Eye, Sun } from "lucide-react";

import Skeleton from "../../components/context/Skeleton";
import EnvKpiGrid from "./components/EnvKpiGrid";
import TemperatureChart from "./components/TemperatureChart";
import AirQualityList from "./components/AirQualityList";
import SensorTable from "./components/SensorTable";
import WeatherForecast from "./components/WeatherForecast";
import SnowAndAtmosphere from "./components/SnowAndAtmosphere";
import EmergencyScenarios from "./components/EmergencyScenarios";

// --- NEW HELPER: Safely clamp floating point numbers ---
const formatMetric = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return Number(val).toFixed(decimals);
};

export default function Environment() {
  const { activeStation = "Maitri" } = useOutletContext() || {};
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchEnv = async (isBackgroundRefresh = false) => {
      if (!isBackgroundRefresh) {
        setLoading(true);
      }
      setError(null);
      try {
        const res = await environmentAPI.getStationEnvironment(activeStation, { signal: abortController.signal });
        if (abortController.signal.aborted) return;
        setData(res.data);
      } catch (err) {
        if (!abortController.signal.aborted && !isBackgroundRefresh) {
          setError(err.message || "Failed to fetch environment data.");
        }
      } finally {
        if (!abortController.signal.aborted) setLoading(false);
      }
    };

    // 1. Fetch immediately
    fetchEnv(false);

    // 2. Silent 30-second polling
    const intervalId = setInterval(() => {
      fetchEnv(true);
    }, 30000);

    return () => { 
      clearInterval(intervalId);
      abortController.abort(); 
    };
  }, [activeStation]);

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
        
        {/* Row 2: Chart & AQI Skeleton */}
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
        
        {/* Row 3: Sensor Table & Snow/Atmosphere Skeleton */}
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
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-full w-full rounded-xl" />)}
            </div>
          </div>
        </div>

        {/* Row 4: Weather & Emergency Skeleton */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[1, 2].map((card) => (
            <div key={card} className="flex flex-col rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[250px]">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-500 font-sans p-6 font-semibold">Error loading environment data: {error}</div>;
  }

  // =========================================================================
  // DATA MAPPING
  // =========================================================================
const ext = data.exterior_conditions;

  const kpis = [
    { label: "External Temp", value: `${formatMetric(ext?.temperature?.outside_temperature_c)}°C`, status: ext?.temperature?.alerts?.is_warning_cold ? "warn" : "ok", icon: Thermometer },
    { label: "Wind Speed", value: `${formatMetric(ext?.wind?.wind_speed_kmh)} km/h`, status: ext?.wind?.alerts?.is_warning_wind ? "warn" : "ok", icon: Wind },
    { label: "Visibility", value: `${formatMetric((ext?.visibility?.visibility_meters || 0) / 1000)} km`, status: ext?.visibility?.alerts?.is_whiteout ? "danger" : "ok", icon: Eye },
    { label: "UV Index", value: `${formatMetric(data.weather_phenomena?.atmospheric?.uv_index, 0)}`, status: "ok", icon: Sun },
  ];

  const sensors = [
    { id: "ENV-MET-01", type: "Anemometer", location: "Main Mast", reading: `${formatMetric(ext?.wind?.wind_speed_kmh)} km/h`, status: ext?.wind?.alerts?.is_warning_wind ? "warn" : "ok" },
    { id: "ENV-BAR-02", type: "Barometer", location: "Exterior Wall", reading: `${formatMetric(data.weather_phenomena?.atmospheric?.atmospheric_pressure_mb)} hPa`, status: "ok" },
    { id: "ENV-THM-01", type: "Thermistor Array", location: "Ice Shelf", reading: `${formatMetric(ext?.temperature?.outside_temperature_c)}°C`, status: ext?.temperature?.alerts?.is_warning_cold ? "warn" : "ok" },
    { id: "ENV-RAD-01", type: "Radiometer", location: "Roof Deck", reading: `${formatMetric(data.solar_conditions?.solar_radiation_w_m2)} W/m²`, status: "ok" },
  ];

  // Directly pulling the live chart arrays from the backend!
  const temperatureSeries = data.temperature_history || [];

  // Map the raw numbers from the backend to the strings the UI components expect
  const airQuality = (data.air_quality || []).map(aq => ({
    zone: aq.zone,
    co2: `${formatMetric(aq.co2_ppm, 0)} ppm`,
    o2: `${formatMetric(aq.o2_percent, 1)}%`,
    status: aq.status
  }));

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans">
      <div className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Environment & Climate
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          {activeStation} Station · Atmospheric telemetry and internal air quality
        </p>
      </div>

      <EnvKpiGrid kpis={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TemperatureChart temperatureSeries={temperatureSeries} />
        <AirQualityList airQuality={airQuality} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col">
          <SensorTable sensors={sensors} />
        </div>
        <div className="lg:col-span-1 flex flex-col">
          <SnowAndAtmosphere environmentJson={data} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WeatherForecast environmentJson={data} />
        <EmergencyScenarios environmentJson={data} />
      </div>
    </div>
  );
}