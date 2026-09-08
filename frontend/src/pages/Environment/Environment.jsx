import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { environmentAPI } from "../../services/api/environment";
import {
  Thermometer,
  Wind,
  Eye,
  Sun,
} from "lucide-react";
import Skeleton from "../../components/context/Skeleton";
import EnvKpiGrid from "./components/EnvKpiGrid";
import TemperatureChart from "./components/TemperatureChart";
import AirQualityList from "./components/AirQualityList";
import SensorTable from "./components/SensorTable";
import WeatherForecast from "./components/WeatherForecast";
import SnowAndAtmosphere from "./components/SnowAndAtmosphere";
import EmergencyScenarios from "./components/EmergencyScenarios";

export default function Environment() {
  const { activeStation = "Maitri" } =
    useOutletContext() || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================================================
  // FETCH ENVIRONMENT DATA
  // =========================================================================

  useEffect(() => {
    let isMounted = true;

    const fetchEnv = async () => {
      setLoading(true);
      setError(null);

      try {
        const res =
          await environmentAPI.getStationEnvironment(
            activeStation
          );

        if (!isMounted) return;

        /*
         * The backend may return the environment object
         * in one of these structures:
         *
         * {
         *   environment: {...}
         * }
         *
         * OR
         *
         * {
         *   data: {
         *      ...
         *   }
         * }
         *
         * Handle both safely.
         */

        const environmentData =
          res?.environment ??
          res?.data?.environment ??
          res?.data ??
          null;

        setData(environmentData);
      } catch (err) {
        if (isMounted) {
          setError(
            err?.message ||
              "Failed to fetch environment data"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEnv();

    return () => {
      isMounted = false;
    };
  }, [activeStation]);

  // =========================================================================
  // LOADING STATE
  // =========================================================================

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

        {/* Row 2: Chart & AQI */}
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

        {/* Row 3: Sensors & Glaciology */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[300px]">
            <div className="flex justify-between mb-6">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-6 w-full rounded-lg" />

              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-12 w-full rounded-lg"
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[300px]">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-20" />
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-full w-full rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Weather & Emergency */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[1, 2].map((card) => (
            <div
              key={card}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-md p-5 dark:border-slate-800/80 dark:bg-slate-900/40 min-h-[250px]"
            >
              <div className="flex justify-between mb-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
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
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // ERROR STATE
  // =========================================================================

  if (error || !data) {
    return (
      <div className="text-red-500 font-sans p-6 font-semibold">
        Error loading environment data:{" "}
        {error || "No environment data available"}
      </div>
    );
  }

  // =========================================================================
  // BACKEND DATA
  //
  // IMPORTANT:
  // Your backend formatter returns snake_case:
  //
  // exterior_conditions
  // outside_temperature_c
  // wind_speed_kmh
  // visibility_meters
  // weather_phenomena
  // uv_index
  // solar_conditions
  // =========================================================================

  const ext = data?.exterior_conditions ?? {};

  const temperature = ext?.temperature ?? {};
  const wind = ext?.wind ?? {};
  const visibility = ext?.visibility ?? {};

  const weather = data?.weather_phenomena ?? {};
  const atmospheric = weather?.atmospheric ?? {};

  const solar = data?.solar_conditions ?? {};

  // =========================================================================
  // KPI DATA
  // =========================================================================

  const kpis = [
    {
      label: "External Temp",
      value: `${temperature?.outside_temperature_c ?? "--"}°C`,
      status: temperature?.alerts?.is_warning_cold
        ? "warn"
        : temperature?.alerts?.is_extreme_cold
        ? "danger"
        : "ok",
      icon: Thermometer,
    },

    {
      label: "Wind Speed",
      value: `${wind?.wind_speed_kmh ?? "--"} km/h`,
      status: wind?.alerts?.is_blizzard_condition
        ? "danger"
        : wind?.alerts?.is_severe_wind
        ? "warn"
        : "ok",
      icon: Wind,
    },

    {
      label: "Visibility",
      value:
        visibility?.visibility_meters != null
          ? `${(
              visibility.visibility_meters / 1000
            ).toFixed(1)} km`
          : "-- km",
      status: visibility?.alerts?.is_whiteout
        ? "danger"
        : visibility?.alerts
              ?.is_severe_visibility_low
        ? "warn"
        : "ok",
      icon: Eye,
    },

    {
      label: "UV Index",
      value: `${atmospheric?.uv_index ?? "--"}`,
      status: "ok",
      icon: Sun,
    },
  ];

  // =========================================================================
  // SENSOR DATA
  // =========================================================================

  const sensors = [
    {
      id: "ENV-MET-01",
      type: "Anemometer",
      location: "Main Mast",
      reading: `${wind?.wind_speed_kmh ?? "--"} km/h`,
      status: wind?.alerts?.is_warning_wind
        ? "warn"
        : "ok",
    },

    {
      id: "ENV-BAR-02",
      type: "Barometer",
      location: "Exterior Wall",
      reading: `${
        atmospheric?.atmospheric_pressure_mb ?? "--"
      } hPa`,
      status: "ok",
    },

    {
      id: "ENV-THM-01",
      type: "Thermistor Array",
      location: "Ice Shelf",
      reading: `${
        temperature?.outside_temperature_c ?? "--"
      }°C`,
      status: temperature?.alerts?.is_warning_cold
        ? "warn"
        : "ok",
    },

    {
      id: "ENV-RAD-01",
      type: "Radiometer",
      location: "Roof Deck",
      reading: `${
        solar?.solar_radiation_w_m2 ?? "--"
      } W/m²`,
      status: "ok",
    },
  ];

  // =========================================================================
  // TEMPERATURE TREND
  //
  // Current endpoint returns the latest environment
  // record, so we create a visual trend from the
  // current temperature and rate of change.
  // =========================================================================

  const baseTemp =
    temperature?.outside_temperature_c ?? -35;

  const tempRate =
    temperature
      ?.temperature_rate_of_change_c_per_hour ?? 0;

  const temperatureSeries = Array.from(
    { length: 7 },
    (_, i) => {
      const hoursAgo = (6 - i) * 4;

      return {
        time: `-${hoursAgo}h`,

        ext: Number(
          (
            baseTemp -
            tempRate * hoursAgo
          ).toFixed(1)
        ),

        int: 21,
      };
    }
  );

  // =========================================================================
  // INTERNAL AIR QUALITY
  //
  // Kept from your existing frontend because these
  // fields are not present in the current environment
  // response/model.
  // =========================================================================

  const airQuality = [
    {
      zone: "Living Quarters",
      co2: "410 ppm",
      o2: "21.0%",
      status: "ok",
    },

    {
      zone: "Research Lab",
      co2: "415 ppm",
      o2: "21.0%",
      status: "ok",
    },

    {
      zone: "Storage Bay",
      co2: "440 ppm",
      o2: "20.9%",
      status: "ok",
    },
  ];

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans">

      {/* PAGE HEADER */}

      <div className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Environment & Climate
        </h1>

        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          {activeStation} Station · Atmospheric telemetry and internal air quality
        </p>
      </div>

      {/* ROW 1: KPI GRID */}

      <EnvKpiGrid kpis={kpis} />

      {/* ROW 2: TEMPERATURE + AIR QUALITY */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <TemperatureChart
          temperatureSeries={temperatureSeries}
        />

        <AirQualityList
          airQuality={airQuality}
        />
      </div>

      {/* ROW 3: SENSOR TABLE + GLACIOLOGY */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        <div className="lg:col-span-2 flex flex-col">
          <SensorTable sensors={sensors} />
        </div>

        <div className="lg:col-span-1 flex flex-col">
          <SnowAndAtmosphere
            environmentJson={data}
          />
        </div>

      </div>

      {/* ROW 4: WEATHER + EMERGENCY */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        <WeatherForecast
          environmentJson={data}
        />

        <EmergencyScenarios
          environmentJson={data}
        />

      </div>

    </div>
  );
}