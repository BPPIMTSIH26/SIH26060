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

export default function Environment() {
  const { activeStation = "Maitri" } = useOutletContext() || {};
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchEnv = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await environmentAPI.getStationEnvironment(activeStation);
        if (isMounted) setData(res.data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchEnv();
    return () => { isMounted = false; };
  }, [activeStation]);

  // =========================================================================
  // OPTIMIZED SKELETON LOADER (Matches the exact 4-row layout below)
  // =========================================================================
  if (loading) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950">
        {/* Header Skeleton */}
        <div className="mb-2 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        
        {/* Row 1: KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 w-full"><Skeleton className="h-full w-full rounded-xl" /></div>
          ))}
        </div>
        
        {/* Row 2: Chart (2/3) + AQI (1/3) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 h-[300px]"><Skeleton className="h-full w-full rounded-xl" /></div>
          <div className="lg:col-span-1 h-[300px]"><Skeleton className="h-full w-full rounded-xl" /></div>
        </div>
        
        {/* Row 3: Sensor Table (2/3) + Snow (1/3) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 h-[300px]"><Skeleton className="h-full w-full rounded-xl" /></div>
          <div className="lg:col-span-1 h-[300px]"><Skeleton className="h-full w-full rounded-xl" /></div>
        </div>

        {/* Row 4: Weather (1/2) + Emergency (1/2) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-[250px]"><Skeleton className="h-full w-full rounded-xl" /></div>
          <div className="h-[250px]"><Skeleton className="h-full w-full rounded-xl" /></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-500 font-mono p-6">Error loading environment data: {error}</div>;
  }

  // =========================================================================
  // DATA MAPPING
  // =========================================================================
  const ext = data.exterior_conditions;

  const kpis = [
    { label: "External Temp", value: `${ext?.temperature?.outside_temperature_c}°C`, status: ext?.temperature?.alerts?.is_warning_cold ? "warn" : "ok", icon: Thermometer },
    { label: "Wind Speed", value: `${ext?.wind?.wind_speed_kmh} km/h`, status: ext?.wind?.alerts?.is_warning_wind ? "warn" : "ok", icon: Wind },
    { label: "Visibility", value: `${(ext?.visibility?.visibility_meters / 1000).toFixed(1)} km`, status: ext?.visibility?.alerts?.is_whiteout ? "danger" : "ok", icon: Eye },
    { label: "UV Index", value: `${data.weather_phenomena?.atmospheric?.uv_index}`, status: "ok", icon: Sun },
  ];

  const sensors = [
    { id: "ENV-MET-01", type: "Anemometer", location: "Main Mast", reading: `${ext?.wind?.wind_speed_kmh} km/h`, status: ext?.wind?.alerts?.is_warning_wind ? "warn" : "ok" },
    { id: "ENV-BAR-02", type: "Barometer", location: "Exterior Wall", reading: `${data.weather_phenomena?.atmospheric?.atmospheric_pressure_mb} hPa`, status: "ok" },
    { id: "ENV-THM-01", type: "Thermistor Array", location: "Ice Shelf", reading: `${ext?.temperature?.outside_temperature_c}°C`, status: ext?.temperature?.alerts?.is_warning_cold ? "warn" : "ok" },
    { id: "ENV-RAD-01", type: "Radiometer", location: "Roof Deck", reading: `${data.solar_conditions?.solar_radiation_w_m2} W/m²`, status: "ok" },
  ];

  const baseTemp = ext?.temperature?.outside_temperature_c ?? -35;
  const tempTrend = ext?.temperature?.temperature_rate_of_change_c_per_hour ?? 0;
  const temperatureSeries = Array.from({ length: 7 }).map((_, i) => ({
    time: `-${(6 - i) * 4}h`,
    ext: Number((baseTemp - (tempTrend * (6 - i) * 4)).toFixed(1)),
    int: 21 
  }));

  const airQuality = [
    { zone: "Living Quarters", co2: "410 ppm", o2: "21.0%", status: "ok" },
    { zone: "Research Lab", co2: "415 ppm", o2: "21.0%", status: "ok" },
    { zone: "Storage Bay", co2: "440 ppm", o2: "20.9%", status: "ok" },
  ];

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950">
      <div className="mb-2">
        <h1 className="font-mono text-2xl font-bold uppercase tracking-tight text-gray-900 dark:text-slate-100">
          Environment & Climate
        </h1>
        <p className="font-mono text-sm text-gray-500 dark:text-slate-400 mt-1">
          {activeStation} Station · Atmospheric telemetry and internal air quality
        </p>
      </div>

      {/* Row 1: KPI Grid */}
      <EnvKpiGrid kpis={kpis} />

      {/* Row 2: Charts and Internal AQI (2/3 and 1/3 split) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TemperatureChart temperatureSeries={temperatureSeries} />
        <AirQualityList airQuality={airQuality} />
      </div>

      {/* Row 3: Sensors and Glaciology (2/3 and 1/3 split) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col">
          <SensorTable sensors={sensors} />
        </div>
        <div className="lg:col-span-1 flex flex-col">
          <SnowAndAtmosphere environmentJson={data} />
        </div>
      </div>

      {/* Row 4: Weather Forecasting and Emergency Protocols (Perfect 50/50 Split) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WeatherForecast environmentJson={data} />
        <EmergencyScenarios environmentJson={data} />
      </div>
      
    </div>
  );
}