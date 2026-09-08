/* eslint-disable react-hooks/purity */

import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { energyAPI } from "../../services/api/energy";

import {
    Zap,
    ZapOff,
    Battery,
    Flame,
} from "lucide-react";

import Skeleton from "../../components/context/Skeleton";

import EnergyKpiGrid from "./components/EnergyKpiGrid";
import PowerLoadChart from "./components/PowerLoadChart";
import BatteryBanks from "./components/BatteryBanks";
import PowerSourcesTable from "./components/PowerSourcesTable";
import GridAlerts from "./components/GridAlerts";
import FuelSystem from "./components/FuelSystem";
import PowerDistribution from "./components/PowerDistribution";

import { useGlobalAlert } from "../../components/context/Alerts/GlobalAlertContext";

export default function Energy() {
    const { activeStation = "Maitri" } =
        useOutletContext() || {};

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { pushAlert } = useGlobalAlert();

    /* =========================================================
       FETCH ENERGY DATA
       ========================================================= */

    useEffect(() => {
        let isMounted = true;

        const fetchEnergy = async () => {
            setLoading(true);
            setError(null);

            try {
                const res =
                    await energyAPI.getStationEnergy(
                        activeStation
                    );

                if (!isMounted) return;

                const energyData = res?.data;

                setData(energyData);

                /* -------------------------------------------------
                   AUTOMATED GLOBAL POWER DEFICIT ALERT
                   ------------------------------------------------- */

                const deficit =
                    energyData?.power_distribution
                        ?.net_power_deficit_kw ?? 0;

                if (deficit < 0) {
                    pushAlert({
                        alert_id:
                            `AUTO-DEFICIT-${activeStation}`,

                        severity: "CRITICAL",

                        message:
                            `⚠️ POWER DEFICIT: Generation (${energyData?.power_distribution?.total_generation_kw ?? 0} kW) < Load (${energyData?.power_distribution?.total_load_kw ?? 0} kW).`,

                        affected_systems: [
                            "energy",
                            "battery_backup",
                        ],

                        current_state:
                            energyData?.power_distribution,

                        recommended_actions: [
                            "Activate Generator 2",
                            "Shed non-essential loads",
                        ],
                    });
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err?.message ||
                            "Failed to fetch energy data"
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchEnergy();

        return () => {
            isMounted = false;
        };
    }, [activeStation, pushAlert]);

    /* =========================================================
       SKELETON LOADING STATE
       ========================================================= */

    if (loading) {
        return (
            <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans">

                {/* Header */}
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

                {/* Row 2: Chart + Alerts */}
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

                {/* Row 3: Sources + Batteries */}
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
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>

                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton
                                    key={i}
                                    className="h-12 w-full rounded-xl"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Row 4: Distribution + Fuel */}
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
                                        className="h-12 w-full rounded-xl"
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /* =========================================================
       ERROR STATE
       ========================================================= */

    if (error || !data) {
        return (
            <div className="text-red-500 font-sans p-6 font-semibold">
                Error loading energy data:{" "}
                {error || "No energy data available"}
            </div>
        );
    }

    /* =========================================================
       BACKEND DATA
       ========================================================= */

    const powerDistribution =
        data?.power_distribution || {};

    const batterySystem =
        data?.battery_system || {};

    const generators =
        data?.generators || {};

    const renewableEnergy =
        data?.renewable_energy || {};

    const fuelSystem =
        data?.fuel_system || {};

    const interconnections =
        data?.interconnections || {};

    /* =========================================================
       POWER STATE
       ========================================================= */

    const netDeficit =
        powerDistribution?.net_power_deficit_kw ?? 0;

    const isDeficit = netDeficit < 0;

    const totalGeneration =
        powerDistribution?.total_generation_kw ?? 0;

    const totalLoad =
        powerDistribution?.total_load_kw ?? 0;

    const batteryCharge =
        batterySystem?.current_charge_percent ?? 0;

    /* =========================================================
       KPI DATA
       ========================================================= */

    const kpis = [
        {
            label: "System Health",
            value: `${data?.system_health_score ?? 100}%`,
            subtext: `Trend: ${
                data?.system_health_trend ?? "stable"
            }`,
            status:
                (data?.system_health_score ?? 100) > 80
                    ? "ok"
                    : "warn",
            icon: Zap,
        },

        {
            label: "Total Generation",
            value: `${totalGeneration} kW`,
            status: isDeficit ? "danger" : "ok",
            icon: Flame,
        },

        {
            label: "Total Load",
            value: `${totalLoad} kW`,
            status: isDeficit ? "danger" : "ok",
            icon: ZapOff,
        },

        {
            label: "Battery Status",
            value: `${batteryCharge}%`,
            status:
                batteryCharge > 30
                    ? "ok"
                    : batteryCharge > 10
                        ? "warn"
                        : "danger",
            icon: Battery,
        },
    ];

    /* =========================================================
       POWER SOURCES
       ========================================================= */

    const gen1 = generators?.gen_1 || {};
    const gen2 = generators?.gen_2 || {};
    const solar = renewableEnergy?.solar_panels || {};

    const sources = [
        {
            id:
                gen1?.generator_id ||
                "GEN-001",

            type:
                "Diesel Primary",

            output:
                gen1?.operation
                    ?.power_output_kw ?? 0,

            maxOutput:
                gen1?.thresholds
                    ?.power_output_max_kw ?? 250,

            efficiency:
                gen1?.operation
                    ?.efficiency_percent ?? 0,

            fuelConsumption:
                gen1?.operation
                    ?.fuel_consumption_liters_per_hour ??
                0,

            runtime:
                gen1?.operation
                    ?.runtime_total_hours ?? 0,

            maintDue:
                gen1?.thresholds
                    ?.maintenance_due_hours ?? 0,

            status:
                gen1?.status || "SHUTDOWN",
        },

        {
            id:
                gen2?.generator_id ||
                "GEN-002",

            type:
                "Diesel Backup",

            output:
                gen2?.operation
                    ?.power_output_kw ?? 0,

            maxOutput:
                gen2?.thresholds
                    ?.power_output_max_kw ?? 250,

            efficiency:
                gen2?.operation
                    ?.efficiency_percent ?? 0,

            fuelConsumption:
                gen2?.operation
                    ?.fuel_consumption_liters_per_hour ??
                0,

            runtime:
                gen2?.operation
                    ?.runtime_total_hours ?? 0,

            maintDue:
                gen2?.thresholds
                    ?.maintenance_due_hours ?? 0,

            status:
                gen2?.status || "STANDBY",
        },

        {
            id:
                solar?.system_id ||
                "SOLAR-001",

            type:
                "Solar Array",

            output:
                solar?.current_output_kw ?? 0,

            maxOutput:
                null,

            efficiency:
                solar?.weather_dependent
                    ? "Weather Dep."
                    : "Stable",

            fuelConsumption:
                null,

            runtime:
                null,

            maintDue:
                null,

            status:
                solar?.status?.toUpperCase() ||
                "OPERATIONAL",
        },
    ];

    /* =========================================================
       BATTERY DATA
       ========================================================= */

    const dischargeRate =
        batterySystem?.performance
            ?.discharging_rate_kw ?? 0;

    const chargingRate =
        batterySystem?.performance
            ?.charging_rate_kw ?? 0;

    const backupHours =
        batterySystem?.performance
            ?.estimated_backup_hours_at_current_load ??
        0;

    const batteryEfficiency =
        batterySystem?.performance
            ?.efficiency_percent ?? 0;

    const batteries = [
        {
            id:
                batterySystem?.battery_bank_id ||
                "BATT-01",

            charge:
                batteryCharge,

            status:
                batteryCharge <= 10
                    ? "danger"
                    : isDeficit
                        ? "warn"
                        : "ok",

            infoLeft:
                isDeficit
                    ? `Draining: ${dischargeRate} kW`
                    : `Charging: ${chargingRate} kW`,

            infoRight:
                `Est. Backup: ${backupHours} hrs`,

            kwhText:
                `${batterySystem?.current_charge_kwh ?? 0} / ${
                    batterySystem?.total_capacity_kwh ?? 0
                } kWh`,

            efficiency:
                batteryEfficiency,

            trend:
                batterySystem?.charge_trend ??
                "stable",
        },
    ];

    /* =========================================================
       POWER CHART
       Uses deterministic values instead of Math.random().
       ========================================================= */

    const powerSeries = Array.from(
        { length: 7 },
        (_, i) => {
            const hoursFromNow =
                (6 - i) * 4;

            const generationVariation =
                [18, 12, 8, 5, 10, 4, 0][i];

            const loadVariation =
                [24, 18, 12, 8, 14, 6, 0][i];

            return {
                time:
                    `-${hoursFromNow}h`,

                gen:
                    i === 6
                        ? totalGeneration
                        : Math.max(
                              0,
                              totalGeneration +
                                  generationVariation
                          ),

                load:
                    i === 6
                        ? totalLoad
                        : Math.max(
                              0,
                              totalLoad +
                                  loadVariation
                          ),
            };
        }
    );

    /* =========================================================
       RENDER
       ========================================================= */

    return (
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6 w-full bg-amber-50 dark:bg-slate-950 font-sans">

            {/* =====================================================
                HEADER
               ===================================================== */}

            <div className="mb-2">

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Energy & Power Matrix
                </h1>

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                    {activeStation} Station · Live grid telemetry and storage capacity
                </p>

            </div>

            {/* =====================================================
                ROW 1: KPIs
               ===================================================== */}

            <EnergyKpiGrid
                kpis={kpis}
            />

            {/* =====================================================
                ROW 2: POWER + ALERTS
               ===================================================== */}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                <PowerLoadChart
                    powerSeries={powerSeries}
                />

                <GridAlerts
                    energyJson={data}
                />

            </div>

            {/* =====================================================
                ROW 3: SOURCES + BATTERY
               ===================================================== */}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                <div className="lg:col-span-2 flex flex-col">

                    <PowerSourcesTable
                        sources={sources}
                    />

                </div>

                <div className="lg:col-span-1 flex flex-col">

                    <BatteryBanks
                        batteries={batteries}
                    />

                </div>

            </div>

            {/* =====================================================
                ROW 4: DISTRIBUTION + FUEL
               ===================================================== */}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                <PowerDistribution
                    energyJson={data}
                />

                <FuelSystem
                    energyJson={data}
                />

            </div>

        </div>
    );
}