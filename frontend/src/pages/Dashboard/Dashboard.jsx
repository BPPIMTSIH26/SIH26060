/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import {
    Activity,
    ShieldCheck,
    Zap,
    Thermometer,
    Box,
    Droplet,
    Wind,
    Battery,
} from "lucide-react";

import { infrastructureAPI } from "../../services/api/infrastructure";
import { energyAPI } from "../../services/api/energy";
import { environmentAPI } from "../../services/api/environment";
import { logisticsAPI } from "../../services/api/logistics";

import { StationOverview } from "./components/StationOverview";
import { PillarCards } from "./components/PillarCards";
import { TrendCharts } from "./components/TrendCharts";

import Skeleton from "../../components/context/Skeleton";

export default function Dashboard() {
    const { activeStation = "Maitri" } =
        useOutletContext() || {};

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* ============================================================
       FETCH ALL STATION DATA
       ============================================================ */

    useEffect(() => {
        let isMounted = true;

        const fetchAllData = async () => {
            setLoading(true);
            setError(null);

            try {
                /*
                 * IMPORTANT:
                 *
                 * Promise.all() would completely fail when even ONE
                 * endpoint returns 404.
                 *
                 * Promise.allSettled() lets the other modules load
                 * successfully even when one module has no data.
                 */
                const results = await Promise.allSettled([
                    infrastructureAPI.getStationInfrastructure(
                        activeStation
                    ),

                    energyAPI.getStationEnergy(
                        activeStation
                    ),

                    environmentAPI.getStationEnvironment(
                        activeStation
                    ),

                    logisticsAPI.getStationLogistics(
                        activeStation
                    ),
                ]);

                if (!isMounted) return;

                const [
                    infraResult,
                    energyResult,
                    envResult,
                    logResult,
                ] = results;

                const infra =
                    infraResult.status === "fulfilled"
                        ? infraResult.value?.data ?? null
                        : null;

                const energy =
                    energyResult.status === "fulfilled"
                        ? energyResult.value?.data ?? null
                        : null;

                const env =
                    envResult.status === "fulfilled"
                        ? envResult.value?.data ?? null
                        : null;

                const logistics =
                    logResult.status === "fulfilled"
                        ? logResult.value?.data ?? null
                        : null;

                /*
                 * Log individual module failures rather than
                 * destroying the complete dashboard.
                 */

                if (
                    infraResult.status ===
                    "rejected"
                ) {
                    console.warn(
                        "Infrastructure data unavailable:",
                        infraResult.reason
                    );
                }

                if (
                    energyResult.status ===
                    "rejected"
                ) {
                    console.warn(
                        "Energy data unavailable:",
                        energyResult.reason
                    );
                }

                if (
                    envResult.status ===
                    "rejected"
                ) {
                    console.warn(
                        "Environment data unavailable:",
                        envResult.reason
                    );
                }

                if (
                    logResult.status ===
                    "rejected"
                ) {
                    console.warn(
                        "Logistics data unavailable:",
                        logResult.reason
                    );
                }

                setDashboardData({
                    infra,
                    energy,
                    env,
                    logistics,
                });

                /*
                 * We intentionally do NOT set the entire page
                 * into an error state when only one module is missing.
                 */

            } catch (err) {
                console.error(
                    "Dashboard synchronization error:",
                    err
                );

                if (isMounted) {
                    setError(
                        err?.message ||
                            "Failed to synchronize station telemetry."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchAllData();

        return () => {
            isMounted = false;
        };
    }, [activeStation]);

    /* ============================================================
       LOADING STATE
       ============================================================ */

    if (loading) {
        return (
            <div className="min-h-screen bg-amber-50 dark:bg-slate-950 font-sans">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6">

                    {/* Station Overview */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                        <div className="h-[530px] w-full">
                            <Skeleton className="h-full w-full rounded-xl" />
                        </div>

                        <div className="flex flex-col gap-4 lg:gap-6">
                            <div className="h-[250px] w-full">
                                <Skeleton className="h-full w-full rounded-xl" />
                            </div>

                            <div className="h-[256px] w-full">
                                <Skeleton className="h-full w-full rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Pillars */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-[130px] w-full"
                            >
                                <Skeleton className="h-full w-full rounded-xl" />
                            </div>
                        ))}
                    </div>

                    {/* Trend Charts */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-[300px] w-full"
                            >
                                <Skeleton className="h-full w-full rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /* ============================================================
       NO DASHBOARD DATA AT ALL
       ============================================================ */

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-amber-50 dark:bg-slate-950 font-sans">
                <div className="p-6 text-red-500 font-semibold">
                    Unable to load dashboard.
                </div>
            </div>
        );
    }

    const {
        infra,
        energy,
        env,
        logistics,
    } = dashboardData;

    /* ============================================================
       SAFE VALUES
       ============================================================ */

    const infrastructureHealth =
        Number(
            infra?.system_health_score
        ) || 100;

    const energyHealth =
        Number(
            energy?.system_health_score
        ) || 100;

    const environmentHealth =
        Number(
            env?.system_health_score
        ) || 100;

    const logisticsHealth =
        Number(
            logistics?.system_health_score
        ) || 100;

    /* ============================================================
       HELPERS
       ============================================================ */

    const clamp = (value) =>
        Math.max(
            0,
            Math.min(
                100,
                Number(value) || 0
            )
        );

    const getHealthStatus = (value) => {
        if (value > 80) return "ok";
        if (value > 50) return "warn";
        return "danger";
    };

    /* ============================================================
       DYNAMIC STATION HEALTH
       ============================================================ */

    const calculateStationHealth = () => {
        let infraScore =
            infrastructureHealth;

        let energyScore =
            energyHealth;

        let envScore =
            environmentHealth;

        let logisticsScore =
            logisticsHealth;

        /* --------------------------------------------------------
           ENERGY PENALTIES
           -------------------------------------------------------- */

        const netPowerDeficit =
            energy
                ?.power_distribution
                ?.net_power_deficit_kw;

        const batteryCharge =
            energy
                ?.battery_system
                ?.current_charge_percent;

        if (
            typeof netPowerDeficit ===
                "number" &&
            netPowerDeficit < 0
        ) {
            energyScore -= 15;
        }

        if (
            typeof batteryCharge ===
                "number" &&
            batteryCharge < 30
        ) {
            energyScore -= 10;
        }

        /* --------------------------------------------------------
           ENVIRONMENT PENALTIES
           -------------------------------------------------------- */

        const coldWarning =
            env
                ?.exterior_conditions
                ?.temperature
                ?.alerts
                ?.is_warning_cold;

        const windWarning =
            env
                ?.exterior_conditions
                ?.wind
                ?.alerts
                ?.is_warning_wind;

        if (coldWarning) {
            envScore -= 5;
        }

        if (windWarning) {
            envScore -= 5;
        }

        /* --------------------------------------------------------
           INFRASTRUCTURE PENALTIES
           -------------------------------------------------------- */

        const snowLoad =
            infra
                ?.structural_health
                ?.snow_load_on_roof_kg;

        const snowWarningThreshold =
            infra
                ?.structural_health
                ?.snow_load_threshold_kg ??
            20000;

        if (
            typeof snowLoad ===
                "number" &&
            snowLoad >
                snowWarningThreshold
        ) {
            infraScore -= 10;
        }

        /* --------------------------------------------------------
           LOGISTICS PENALTIES
           -------------------------------------------------------- */

        const foodStockDays =
            logistics
                ?.supplies
                ?.food
                ?.current_stock_days;

        if (
            typeof foodStockDays ===
                "number" &&
            foodStockDays < 30
        ) {
            logisticsScore -= 10;
        }

        /* --------------------------------------------------------
           CLAMP
           -------------------------------------------------------- */

        const cInfra =
            clamp(infraScore);

        const cEnergy =
            clamp(energyScore);

        const cEnv =
            clamp(envScore);

        const cLog =
            clamp(logisticsScore);

        /* --------------------------------------------------------
           FINAL SCORE
           -------------------------------------------------------- */

        const finalScore =
            Math.round(
                (
                    cInfra +
                    cEnergy +
                    cEnv +
                    cLog
                ) / 4
            );

        /* --------------------------------------------------------
           TREND
           -------------------------------------------------------- */

        let trend = "stable";

        if (finalScore < 75) {
            trend = "deteriorating";
        } else if (finalScore > 90) {
            trend = "improving";
        }

        /* --------------------------------------------------------
           BREAKDOWN
           -------------------------------------------------------- */

        const breakdown = [
            {
                label: "Energy",
                value: cEnergy,
                status:
                    getHealthStatus(
                        cEnergy
                    ),
            },
            {
                label: "Infrastructure",
                value: cInfra,
                status:
                    getHealthStatus(
                        cInfra
                    ),
            },
            {
                label: "Climate",
                value: cEnv,
                status:
                    getHealthStatus(
                        cEnv
                    ),
            },
            {
                label: "Logistics",
                value: cLog,
                status:
                    getHealthStatus(
                        cLog
                    ),
            },
        ];

        return {
            value: finalScore,
            score: finalScore,
            trend,
            breakdown,
        };
    };

    const dynamicHealth =
        calculateStationHealth();

    /* ============================================================
       ALERT AGGREGATION
       ============================================================ */

    const allAlerts = [
        ...(infra?.alerts_local || []),
        ...(env?.alerts_local || []),
        ...(logistics?.alerts_local || []),
    ];

    /* ============================================================
       ENERGY ALERT
       ============================================================ */

    const energyAlert =
        energy
            ?.power_distribution
            ?.net_power_deficit_kw < 0;

    if (energyAlert) {
        allAlerts.push({
            severity: "WARNING",
            message:
                "Power distribution is reporting a net power deficit.",
            module:
                "POWER DISTRIBUTION",
        });
    }

    /* ============================================================
       ENVIRONMENT ALERTS
       ============================================================ */

    if (
        env
            ?.exterior_conditions
            ?.wind
            ?.alerts
            ?.is_whiteout
    ) {
        allAlerts.push({
            severity: "CRITICAL",
            message:
                "Whiteout conditions detected.",
            module: "ENVIRONMENT",
        });
    }

    /* ============================================================
       NORMALIZE INFRASTRUCTURE MODULES
       ============================================================ */

    const infrastructureModules =
        Object.entries(
            infra?.modules || {}
        ).map(
            ([
                moduleKey,
                moduleData,
            ]) => ({
                ...moduleData,

                module_id:
                    moduleData?.module_id ||
                    moduleKey,

                module_name:
                    moduleKey,
            })
        );

    /* ============================================================
       STATION MAP ENVIRONMENT
       ============================================================ */

    const stationEnvironment = {
        windDirection:
            env
                ?.exterior_conditions
                ?.wind
                ?.wind_direction ??
            0,

        windSpeed:
            env
                ?.exterior_conditions
                ?.wind
                ?.wind_speed_kmh ??
            0,

        outsideTemp:
            env
                ?.exterior_conditions
                ?.temperature
                ?.outside_temperature_c ??
            0,
    };

    /* ============================================================
       PILLAR STATUS
       ============================================================ */

    const infraPillarScore =
        clamp(infrastructureHealth);

    const energyPillarScore =
        clamp(energyHealth);

    const envPillarScore =
        clamp(environmentHealth);

    const logisticsPillarScore =
        clamp(logisticsHealth);

    /* ============================================================
       PILLAR CARDS
       ============================================================ */

    const pillars = [
        {
            id: "infra",

            title: "Infrastructure",

            status:
                getHealthStatus(
                    infraPillarScore
                ),

            icon: ShieldCheck,

            link: "/infrastructure",

            metrics: [
                {
                    label: "Integrity",

                    value: `${infra
                        ?.structural_health
                        ?.structural_integrity_percent ??
                        0}%`,

                    icon: Activity,
                },

                {
                    label: "Snow Load",

                    value: `${(
                        (
                            infra
                                ?.structural_health
                                ?.snow_load_on_roof_kg ??
                            0
                        ) / 1000
                    ).toFixed(1)}t`,

                    icon: Box,
                },
            ],
        },

        {
            id: "energy",

            title: "Energy Grid",

            status:
                energyAlert
                    ? "danger"
                    : getHealthStatus(
                          energyPillarScore
                      ),

            icon: Zap,

            link: "/energypower",

            metrics: [
                {
                    label: "Load",

                    value: `${energy
                        ?.power_distribution
                        ?.total_load_kw ??
                        0} kW`,

                    icon: Zap,
                },

                {
                    label: "Battery",

                    value: `${energy
                        ?.battery_system
                        ?.current_charge_percent ??
                        0}%`,

                    icon: Battery,
                },
            ],
        },

        {
            id: "env",

            title: "Environment",

            status:
                getHealthStatus(
                    envPillarScore
                ),

            icon: Thermometer,

            link: "/environment",

            metrics: [
                {
                    label: "Ext Temp",

                    value: `${env
                        ?.exterior_conditions
                        ?.temperature
                        ?.outside_temperature_c ??
                        0}°C`,

                    icon: Thermometer,
                },

                {
                    label: "Wind",

                    value: `${env
                        ?.exterior_conditions
                        ?.wind
                        ?.wind_speed_kmh ??
                        0} km/h`,

                    icon: Wind,
                },
            ],
        },

        {
            id: "logistics",

            title: "Logistics",

            status:
                logistics
                    ?.supplies
                    ?.food
                    ?.status ===
                "adequate"
                    ? "ok"
                    : "warn",

            icon: Box,

            link: "/logistics",

            metrics: [
                {
                    label: "Food",

                    value: `${logistics
                        ?.supplies
                        ?.food
                        ?.current_stock_days ??
                        0} Days`,

                    icon: Box,
                },

                {
                    label: "Fuel Res.",

                    value: `${logistics
                        ?.fuel_reserves
                        ?.reserve_status_percent ??
                        0}%`,

                    icon: Droplet,
                },
            ],
        },
    ];

    /* ============================================================
       POWER SERIES
       ============================================================ */

    const generation =
        Number(
            energy
                ?.power_distribution
                ?.total_generation_kw
        ) || 0;

    const load =
        Number(
            energy
                ?.power_distribution
                ?.total_load_kw
        ) || 0;

    const powerSeries =
        Array.from({ length: 7 }).map(
            (_, index) => ({
                t: `-${(6 - index) * 4}h`,
                generation,
                load,
            })
        );

    /* ============================================================
       TEMPERATURE SERIES
       ============================================================ */

    const quartersTemp =
        Number(
            infra
                ?.modules
                ?.living_quarters
                ?.thermal_management
                ?.indoor_temperature_c
        ) || 0;

    const labTemp =
        Number(
            infra
                ?.modules
                ?.main_lab
                ?.thermal_management
                ?.indoor_temperature_c
        ) || 0;

    const storageTemp =
        Number(
            infra
                ?.modules
                ?.storage_module
                ?.thermal_management
                ?.indoor_temperature_c
        ) || 0;

    const tempSeries =
        Array.from({ length: 7 }).map(
            (_, index) => ({
                day: `Day ${index + 1}`,
                quarters: quartersTemp,
                lab: labTemp,
                storage: storageTemp,
            })
        );

    /* ============================================================
       FUEL SERIES
       ============================================================ */

    const fuelPercent =
        Number(
            logistics
                ?.fuel_reserves
                ?.reserve_status_percent
        ) || 0;

    const fuelSeries =
        Array.from({ length: 7 }).map(
            (_, index) => ({
                t: `-${(6 - index) * 12}h`,

                primary: Math.max(
                    0,
                    fuelPercent -
                        (6 - index) * 2
                ),

                reserve: fuelPercent,
            })
        );

    /* ============================================================
       RENDER
       ============================================================ */

    return (
        <div className="min-h-screen bg-amber-50 dark:bg-slate-950 text-slate-50 font-sans">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6 lg:gap-6">

                {/* =================================================
                    STATION OVERVIEW
                   ================================================= */}

                <StationOverview
                    activeStation={
                        activeStation
                    }
                    modules={
                        infrastructureModules
                    }
                    health={
                        dynamicHealth
                    }
                    alerts={
                        allAlerts
                    }
                    environment={
                        stationEnvironment
                    }
                />

                {/* =================================================
                    PILLAR CARDS
                   ================================================= */}

                <PillarCards
                    pillars={pillars}
                />

                {/* =================================================
                    TREND CHARTS
                   ================================================= */}

                <TrendCharts
                    powerSeries={
                        powerSeries
                    }
                    tempSeries={
                        tempSeries
                    }
                    fuelSeries={
                        fuelSeries
                    }
                />

                {/* =================================================
                    PARTIAL DATA NOTICE
                   ================================================= */}

                {(error ||
                    !infra ||
                    !energy ||
                    !env ||
                    !logistics) && (
                    <div className="rounded-xl border border-amber-300/30 bg-amber-100/10 px-4 py-3 text-sm text-amber-200">
                        Some station telemetry is
                        currently unavailable. Available
                        modules are still being displayed.
                    </div>
                )}
            </div>
        </div>
    );
}