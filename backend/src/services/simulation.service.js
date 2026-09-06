import Environment from "../models/environmentModel.js";
import Energy from "../models/energyModel.js";
import Infrastructure from "../models/infrastructureModel.js";

import Station from "../models/stationModel.js";

import {
    saveMasterAlertSnapshot
} from "./masterAlert.service.js";

let simulationInterval = null;

const TICK_RATE_SEC = 2;

const simulationState = {};

const randomBetween = (
    min,
    max
) => {
    return Math.random() *
        (max - min) +
        min;
};

const round = (
    value,
    decimals = 2
) => {
    const factor =
        10 ** decimals;

    return Math.round(
        value * factor
    ) / factor;
};

const clamp = (
    value,
    min,
    max
) => {
    return Math.min(
        Math.max(value, min),
        max
    );
};

const getInitialState = (
    stationId
) => {
    return {
        station_id:
            stationId,

        environment: {
            temperature_c: -35.2,
            wind_speed_kmh: 42.5,
            wind_gust_kmh: 68.3,
            visibility_meters: 3200,
            blizzard_active: false
        },

        energy: {
            gen1_status: "ACTIVE",
            gen1_output_kw: 185.5,
            gen1_fuel_consumption_lph: 85,

            gen2_status: "STANDBY",
            gen2_output_kw: 0,

            fuel_liters: 38250,

            battery_kwh: 138,

            load_kw: 245.5,

            solar_output_kw: 60
        },

        infrastructure: {
            hvac_status: "nominal",

            living_quarters_temperature_c:
                18.5,

            main_lab_temperature_c:
                19.2,

            storage_temperature_c:
                -5,

            snow_load_kg:
                15000
        }
    };
};

const getSimulationState = (
    stationId
) => {
    const normalized =
        stationId
            .trim()
            .toUpperCase();

    if (
        !simulationState[
            normalized
        ]
    ) {
        simulationState[
            normalized
        ] = getInitialState(
            normalized
        );
    }

    return simulationState[
        normalized
    ];
};

const calculateVisibility = (
    windSpeed,
    currentVisibility
) => {
    if (
        windSpeed > 100
    ) {
        return clamp(
            currentVisibility -
                randomBetween(
                    150,
                    300
                ),
            100,
            5000
        );
    }

    if (
        windSpeed > 80
    ) {
        return clamp(
            currentVisibility -
                randomBetween(
                    75,
                    175
                ),
            100,
            5000
        );
    }

    return clamp(
        currentVisibility +
            randomBetween(
                20,
                80
            ),
        100,
        5000
    );
};

const simulateEnvironment = (
    state
) => {
    const windChange =
        randomBetween(
            -3,
            3
        );

    state.environment
        .wind_speed_kmh =
        clamp(
            state.environment
                .wind_speed_kmh +
                windChange,
            5,
            130
        );

    state.environment
        .wind_gust_kmh =
        clamp(
            state.environment
                .wind_speed_kmh +
                randomBetween(
                    10,
                    25
                ),
            5,
            150
        );

    let temperatureChange =
        randomBetween(
            -0.2,
            0.2
        );

    if (
        state.environment
            .wind_speed_kmh >
        80
    ) {
        temperatureChange -=
            0.05;
    }

    state.environment
        .temperature_c =
        round(
            state.environment
                .temperature_c +
                temperatureChange,
            2
        );

    state.environment
        .visibility_meters =
        Math.round(
            calculateVisibility(
                state.environment
                    .wind_speed_kmh,
                state.environment
                    .visibility_meters
            )
        );

    state.environment
        .blizzard_active =
        state.environment
            .wind_speed_kmh >
            100 &&
        state.environment
            .visibility_meters <
            500;
};

const simulateEnergy = (
    state
) => {
    state.energy.load_kw =
        round(
            clamp(
                state.energy
                    .load_kw +
                    randomBetween(
                        -5,
                        5
                    ),
                150,
                400
            ),
            2
        );

    if (
        state.environment
            .temperature_c <
        -40
    ) {
        state.energy.load_kw =
            round(
                state.energy.load_kw +
                    5,
                2
            );
    }

    const totalGeneration =
        state.energy
            .gen1_output_kw +
        state.energy
            .gen2_output_kw +
        state.energy
            .solar_output_kw;

    const deficit =
        totalGeneration -
        state.energy.load_kw;

    if (
        deficit < 0
    ) {
        const drain =
            Math.abs(
                deficit
            ) *
            (
                TICK_RATE_SEC /
                3600
            );

        state.energy
            .battery_kwh =
            clamp(
                state.energy
                    .battery_kwh -
                    drain,
                0,
                150
            );
    }

    const fuelBurn =
        (
            state.energy
                .gen1_status ===
            "ACTIVE"
                ? state.energy
                    .gen1_fuel_consumption_lph
                : 0
        ) *
        (
            TICK_RATE_SEC /
            3600
        );

    state.energy
        .fuel_liters =
        clamp(
            state.energy
                .fuel_liters -
                fuelBurn,
            0,
            50000
        );

    if (
        state.energy
            .fuel_liters <=
        5000
    ) {
        state.energy.gen1_status =
            "FAULT";

        state.energy.gen1_output_kw =
            0;

        state.energy.gen2_status =
            "ACTIVE";

        state.energy.gen2_output_kw =
            185;
    }

    if (
        state.energy
            .battery_kwh <=
        20 &&
        state.energy
            .gen2_status ===
            "STANDBY"
    ) {
        state.energy.gen2_status =
            "ACTIVE";

        state.energy.gen2_output_kw =
            185;
    }

    if (
        state.energy
            .gen1_status ===
        "FAULT"
    ) {
        state.energy.gen1_output_kw =
            0;
    }
};

const simulateInfrastructure = (
    state
) => {
    const hvacFault =
        state.infrastructure
            .hvac_status ===
        "fault";

    if (hvacFault) {
        state.infrastructure
            .living_quarters_temperature_c =
            round(
                state.infrastructure
                    .living_quarters_temperature_c -
                    0.1,
                2
            );

        state.infrastructure
            .main_lab_temperature_c =
            round(
                state.infrastructure
                    .main_lab_temperature_c -
                    0.1,
                2
            );
    } else {
        state.infrastructure
            .living_quarters_temperature_c =
            round(
                state.infrastructure
                    .living_quarters_temperature_c +
                    randomBetween(
                        -0.05,
                        0.05
                    ),
                2
            );

        state.infrastructure
            .main_lab_temperature_c =
            round(
                state.infrastructure
                    .main_lab_temperature_c +
                    randomBetween(
                        -0.05,
                        0.05
                    ),
                2
            );
    }

    if (
        state.environment
            .blizzard_active
    ) {
        state.infrastructure
            .snow_load_kg +=
            15;
    }

    if (
        state.infrastructure
            .snow_load_kg >=
        25000
    ) {
        state.infrastructure
            .snow_load_kg = 25000;
    }
};

const calculateEnvironmentHealth =
    (state) => {
        let score = 100;

        if (
            state.environment
                .temperature_c <=
            -50
        ) {
            score -= 35;
        } else if (
            state.environment
                .temperature_c <=
            -40
        ) {
            score -= 20;
        } else if (
            state.environment
                .temperature_c <=
            -35
        ) {
            score -= 10;
        }

        if (
            state.environment
                .wind_speed_kmh >=
            100
        ) {
            score -= 35;
        } else if (
            state.environment
                .wind_speed_kmh >=
            75
        ) {
            score -= 20;
        }

        if (
            state.environment
                .visibility_meters <=
            500
        ) {
            score -= 35;
        } else if (
            state.environment
                .visibility_meters <=
            1000
        ) {
            score -= 20;
        }

        return clamp(
            score,
            0,
            100
        );
    };

const buildEnvironmentDocument =
    (state) => {
        const temperature =
            state.environment
                .temperature_c;

        const wind =
            state.environment
                .wind_speed_kmh;

        const gust =
            state.environment
                .wind_gust_kmh;

        const visibility =
            state.environment
                .visibility_meters;

        return {
            station_id:
                state.station_id,

            timestamp:
                new Date(),

            polling_interval_seconds:
                TICK_RATE_SEC,

            exteriorConditions: {
                temperature: {
                    outsideTemperatureC:
                        temperature,

                    temperatureTrend:
                        temperature <
                        -35
                            ? "decreasing"
                            : "stable",

                    temperatureRateOfChangeCPerHour:
                        -0.5,

                    thresholds: {
                        extremeColdC:
                            -50,

                        severeColdC:
                            -40,

                        warningColdC:
                            -35
                    },

                    alerts: {
                        isExtremeCold:
                            temperature <=
                            -50,

                        isSevereCold:
                            temperature <=
                            -40,

                        isWarningCold:
                            temperature <=
                            -35
                    }
                },

                wind: {
                    windSpeedKmh:
                        round(
                            wind,
                            2
                        ),

                    windGustKmh:
                        round(
                            gust,
                            2
                        ),

                    windDirection:
                        "SSE",

                    windDirectionDegrees:
                        157,

                    windTrend:
                        wind > 60
                            ? "increasing"
                            : "stable",

                    thresholds: {
                        blizzardThresholdKmh:
                            100,

                        severeWindThresholdKmh:
                            75,

                        warningWindThresholdKmh:
                            60
                    },

                    alerts: {
                        isBlizzardCondition:
                            wind >=
                                100 &&
                            visibility <
                                500,

                        isSevereWind:
                            wind >= 75,

                        isWarningWind:
                            wind >= 60
                    }
                },

                visibility: {
                    visibilityMeters:
                        visibility,

                    visibilityTrend:
                        wind > 80
                            ? "decreasing"
                            : "improving",

                    thresholds: {
                        whiteoutMeters:
                            100,

                        severeVisibilityMeters:
                            500,

                        poorVisibilityMeters:
                            1000
                    },

                    alerts: {
                        isWhiteout:
                            visibility <=
                            100,

                        isSevereVisibilityLow:
                            visibility <=
                            500
                    }
                }
            },

            weatherPhenomena: {
                blizzard: {
                    blizzardWarning:
                        wind >= 75,

                    blizzardActive:
                        state.environment
                            .blizzard_active,

                    blizzardTriggerConditions: {
                        windSpeedKmh:
                            wind,

                        windThreshold:
                            100,

                        visibilityMeters:
                            visibility,

                        visibilityThreshold:
                            500,

                        bothConditionsMet:
                            wind >=
                                100 &&
                            visibility <
                                500
                    },

                    estimatedBlizzardDurationHours:
                        state.environment
                            .blizzard_active
                            ? 6
                            : 0,

                    fieldTeamsAffectedCount:
                        state.environment
                            .blizzard_active
                            ? 12
                            : 0
                },

                precipitation: {
                    precipitationType:
                        state.environment
                            .blizzard_active
                            ? "heavy_snow"
                            : "none",

                    precipitationRateMmPerHour:
                        state.environment
                            .blizzard_active
                            ? 5
                            : 0,

                    snowAccumulationTodayMm:
                        state.environment
                            .blizzard_active
                            ? 50
                            : 0,

                    totalSnowDepthOnGroundCm:
                        185
                },

                atmospheric: {
                    atmosphericPressureMb:
                        1013.2,

                    pressureTrend:
                        "stable",

                    humidityPercent:
                        68,

                    uvIndex:
                        4,

                    ozoneLevelDobsonUnits:
                        280
                }
            },

            solarConditions: {
                solarRadiationWM2:
                    450,

                solarRadiationTrend:
                    "stable",

                seasonalPhase:
                    "austral_summer",

                daylightHours:
                    18,

                solarPanelEfficiencyPercent:
                    78
            },

            alertsLocal: [],

            systemHealthScore:
                calculateEnvironmentHealth(
                    state
                ),

            overallWeatherRisk:
                state.environment
                    .blizzard_active
                    ? "critical"
                    : wind >= 75
                    ? "high"
                    : temperature <=
                      -35
                    ? "medium"
                    : "low"
        };
    };

const buildEnergyDocument = (
    state
) => {
    const totalGeneration =
        state.energy
            .gen1_output_kw +
        state.energy
            .gen2_output_kw +
        state.energy
            .solar_output_kw;

    const deficit =
        totalGeneration -
        state.energy.load_kw;

    const fuelPercent =
        (
            state.energy
                .fuel_liters /
            50000
        ) *
        100;

    const batteryPercent =
        (
            state.energy
                .battery_kwh /
            150
        ) *
        100;

    const generation =
        totalGeneration;

    const estimatedBackupHours =
        deficit < 0
            ? round(
                state.energy
                    .battery_kwh /
                Math.abs(deficit),
                2
            )
            : 99;

    const gen1MaintenanceDue =
        5000 -
        4250;

    return {
        station_id:
            state.station_id,

        timestamp:
            new Date(),

        polling_interval_seconds:
            TICK_RATE_SEC,

        generators: {
            gen_1: {
                generator_id:
                    "GEN-001",

                status:
                    state.energy
                        .gen1_status,

                status_values: [
                    "ACTIVE",
                    "STANDBY",
                    "STARTING",
                    "SHUTDOWN",
                    "FAULT",
                    "MAINTENANCE"
                ],

                status_color:
                    state.energy
                        .gen1_status ===
                    "ACTIVE"
                        ? "green"
                        : "red",

                operation: {
                    runtime_total_hours:
                        4250,

                    runtime_since_maintenance_hours:
                        850,

                    fuel_consumption_liters_per_hour:
                        state.energy
                            .gen1_fuel_consumption_lph,

                    power_output_kw:
                        state.energy
                            .gen1_output_kw,

                    efficiency_percent:
                        88
                },

                thresholds: {
                    maintenance_interval_hours:
                        5000,

                    maintenance_due_hours:
                        gen1MaintenanceDue,

                    fuel_consumption_max_lph:
                        95,

                    power_output_max_kw:
                        250,

                    overload_threshold_kw:
                        240
                }
            },

            gen_2: {
                generator_id:
                    "GEN-002",

                status:
                    state.energy
                        .gen2_status,

                status_values: [
                    "ACTIVE",
                    "STANDBY",
                    "STARTING",
                    "SHUTDOWN",
                    "FAULT",
                    "MAINTENANCE"
                ],

                status_color:
                    state.energy
                        .gen2_status ===
                    "ACTIVE"
                        ? "green"
                        : "yellow",

                operation: {
                    runtime_total_hours:
                        2100,

                    runtime_since_maintenance_hours:
                        400,

                    fuel_consumption_liters_per_hour:
                        state.energy
                            .gen2_status ===
                        "ACTIVE"
                            ? 85
                            : 0,

                    power_output_kw:
                        state.energy
                            .gen2_output_kw,

                    ready_for_activation:
                        state.energy
                            .gen2_status ===
                        "STANDBY"
                },

                thresholds: {
                    maintenance_interval_hours:
                        5000,

                    maintenance_due_hours:
                        4600,

                    power_output_max_kw:
                        250
                }
            }
        },

        fuel_system: {
            primary_tank: {
                tank_id:
                    "FUEL-TANK-01",

                total_capacity_liters:
                    50000,

                current_level_liters:
                    round(
                        state.energy
                            .fuel_liters,
                        2
                    ),

                current_level_percent:
                    round(
                        fuelPercent,
                        2
                    ),

                level_trend:
                    "decreasing",

                consumption_rate_liters_per_day:
                    2040,

                days_until_empty:
                    round(
                        state.energy
                            .fuel_liters /
                        2040,
                        1
                    ),

                thresholds: {
                    critical_low_liters:
                        5000,

                    critical_low_percent:
                        10,

                    warning_low_liters:
                        15000,

                    warning_low_percent:
                        30
                }
            },

            emergency_reserve: {
                tank_id:
                    "FUEL-EMERGENCY-01",

                total_capacity_liters:
                    10000,

                current_level_liters:
                    10000,

                current_level_percent:
                    100,

                reserve_purpose:
                    "Emergency power for 48 hours of essential systems",

                auto_lockout_at_percent:
                    5
            }
        },

        power_distribution: {
            total_generation_kw:
                round(
                    generation,
                    2
                ),

            total_load_kw:
                round(
                    state.energy.load_kw,
                    2
                ),

            net_power_deficit_kw:
                round(
                    deficit,
                    2
                ),

            power_sourcing:
                deficit < 0
                    ? "battery_backup_active"
                    : "generator",

            loads_by_section: {
                living_quarters: {
                    load_kw:
                        85.2,

                    percent_of_total:
                        round(
                            (
                                85.2 /
                                state.energy
                                    .load_kw
                            ) *
                            100,
                            1
                        ),

                    status:
                        "operational"
                },

                main_lab: {
                    load_kw:
                        95.3,

                    percent_of_total:
                        round(
                            (
                                95.3 /
                                state.energy
                                    .load_kw
                            ) *
                            100,
                            1
                        ),

                    status:
                        "operational"
                },

                hvac_system: {
                    load_kw:
                        35.5,

                    percent_of_total:
                        round(
                            (
                                35.5 /
                                state.energy
                                    .load_kw
                            ) *
                            100,
                            1
                        ),

                    status:
                        "operational"
                },

                critical_systems: {
                    load_kw:
                        20,

                    percent_of_total:
                        round(
                            (
                                20 /
                                state.energy
                                    .load_kw
                            ) *
                            100,
                            1
                        ),

                    status:
                        "operational"
                },

                other: {
                    load_kw:
                        9.5,

                    percent_of_total:
                        round(
                            (
                                9.5 /
                                state.energy
                                    .load_kw
                            ) *
                            100,
                            1
                        ),

                    status:
                        "operational"
                }
            },

            thresholds: {
                max_load_kw:
                    400,

                warning_load_kw:
                    350,

                deficit_warning_kw:
                    -50
            }
        },

        battery_system: {
            battery_bank_id:
                "BATT-BANK-01",

            total_capacity_kwh:
                150,

            current_charge_kwh:
                round(
                    state.energy
                        .battery_kwh,
                    2
                ),

            current_charge_percent:
                round(
                    batteryPercent,
                    2
                ),

            charge_trend:
                deficit < 0
                    ? "decreasing"
                    : "stable",

            performance: {
                charging_rate_kw:
                    0,

                discharging_rate_kw:
                    deficit < 0
                        ? Math.abs(
                            deficit
                        )
                        : 0,

                estimated_backup_hours_at_current_load:
                    estimatedBackupHours,

                efficiency_percent:
                    95
            },

            thresholds: {
                critical_low_percent:
                    10,

                warning_low_percent:
                    20,

                max_discharge_rate_kw:
                    120
            }
        },

        renewable_energy: {
            solar_panels: {
                system_id:
                    "SOLAR-001",

                status:
                    "operational",

                current_output_kw:
                    state.energy
                        .solar_output_kw,

                seasonal_phase:
                    "summer_high_output",

                weather_dependent:
                    true
            }
        },

        interconnections: {
            critical_alert:
                deficit < -50
                    ? "POWER_DEFICIT_ACTIVE"
                    : "",

            alert_description:
                deficit < -50
                    ? `Generation (${round(
                        generation,
                        1
                    )} kW) < Load (${round(
                        state.energy
                            .load_kw,
                        1
                    )} kW). Battery backup active.`
                    : "",

            recommended_action:
                deficit < -50
                    ? "Activate Gen-2 or reduce non-critical load"
                    : "Continue normal operation",

            severity:
                deficit <= -100
                    ? "CRITICAL"
                    : deficit < -50
                    ? "WARNING"
                    : "INFO"
        },

        system_health_score:
            round(
                clamp(
                    100 +
                        (
                            deficit < 0
                                ? deficit /
                                  4
                                : 0
                        ) -
                        (
                            batteryPercent <
                            20
                                ? 25
                                : 0
                        ),
                    0,
                    100
                ),
                0
            ),

        system_health_trend:
            deficit < 0
                ? "deteriorating"
                : "stable"
    };
};

const buildInfrastructureDocument =
    (state) => {
        const snowLoad =
            state.infrastructure
                .snow_load_kg;

        const snowCritical =
            25000;

        const structuralIntegrity =
            clamp(
                100 -
                    (
                        snowLoad /
                        snowCritical
                    ) *
                    10,
                0,
                100
            );

        return {
            station_id:
                state.station_id,

            station_name:
                `${state.station_id} Antarctic Research Station`,

            timestamp:
                new Date(),

            polling_interval_seconds:
                5,

            modules: {
                living_quarters: {
                    module_id:
                        "MOD-LQ-001",

                    status:
                        "operational",

                    status_values: [
                        "operational",
                        "fault",
                        "maintenance",
                        "offline"
                    ],

                    status_color:
                        "green",

                    thermal_management: {
                        indoor_temperature_c:
                            state.infrastructure
                                .living_quarters_temperature_c,

                        temperature_setpoint_c:
                            20,

                        temperature_critical_low_c:
                            5,

                        temperature_warning_low_c:
                            10,

                        temperature_trend:
                            "stable",

                        heating_active:
                            true
                    },

                    environmental: {
                        humidity_percent:
                            45,

                        humidity_max_threshold:
                            60,

                        humidity_warning_threshold:
                            55,

                        air_circulation_status:
                            "nominal",

                        co2_level_ppm:
                            420
                    },

                    safety: {
                        fire_alarm_status:
                            false,

                        smoke_detector_status:
                            "active",

                        sprinkler_system:
                            "active",

                        emergency_exits_clear:
                            true
                    },

                    occupancy: {
                        current_occupants:
                            6,

                        max_capacity:
                            8,

                        occupancy_percent:
                            75
                    }
                },

                main_lab: {
                    module_id:
                        "MOD-LAB-001",

                    status:
                        "operational",

                    status_values: [
                        "operational",
                        "fault",
                        "maintenance",
                        "offline"
                    ],

                    status_color:
                        "green",

                    thermal_management: {
                        indoor_temperature_c:
                            state.infrastructure
                                .main_lab_temperature_c,

                        temperature_setpoint_c:
                            20,

                        temperature_critical_low_c:
                            5,

                        temperature_warning_low_c:
                            10,

                        temperature_trend:
                            "stable",

                        heating_active:
                            true
                    },

                    environmental: {
                        humidity_percent:
                            42,

                        humidity_max_threshold:
                            50,

                        air_circulation_status:
                            "nominal"
                    },

                    equipment: {
                        research_equipment_operational_percent:
                            100,

                        critical_equipment_status:
                            "all_operational",

                        freezer_units_temp_c:
                            -20
                    },

                    safety: {
                        fire_alarm_status:
                            false,

                        chemical_storage_secure:
                            true
                    }
                },

                storage_module: {
                    module_id:
                        "MOD-STORAGE-001",

                    status:
                        "operational",

                    status_values: [
                        "operational",
                        "fault",
                        "maintenance",
                        "offline"
                    ],

                    status_color:
                        "green",

                    thermal_management: {
                        indoor_temperature_c:
                            state.infrastructure
                                .storage_temperature_c,

                        temperature_setpoint_c:
                            -5,

                        temperature_critical_high_c:
                            0,

                        temperature_warning_high_c:
                            -2,

                        temperature_trend:
                            "stable",

                        refrigeration_active:
                            true
                    },

                    inventory_storage: {
                        total_capacity_percent:
                            85,

                        food_storage_status:
                            "adequate",

                        medical_storage_status:
                            "adequate"
                    }
                }
            },

            systems: {
                hvac_main: {
                    system_id:
                        "HVAC-001",

                    status:
                        state.infrastructure
                            .hvac_status,

                    status_values: [
                        "nominal",
                        "fault",
                        "degraded",
                        "maintenance"
                    ],

                    status_color:
                        state.infrastructure
                            .hvac_status ===
                        "nominal"
                            ? "green"
                            : "red",

                    description:
                        "Primary heating, ventilation, and air conditioning system",

                    operation: {
                        heating_active:
                            true,

                        ventilation_active:
                            true,

                        backup_available:
                            true,

                        efficiency_percent:
                            94
                    },

                    performance: {
                        air_circulation_cfm:
                            5420,

                        target_circulation_cfm:
                            5500,

                        heat_exchanger_efficiency_percent:
                            94
                    },

                    thresholds: {
                        maintenance_due_hours:
                            250,

                        last_maintenance_date:
                            new Date(
                                "2026-08-20"
                            ),

                        next_maintenance_due:
                            new Date(
                                "2026-10-15"
                            )
                    }
                },

                hvac_backup: {
                    system_id:
                        "HVAC-BACKUP-001",

                    status:
                        "standby",

                    backup_heating_available:
                        true
                }
            },

            structural_health: {
                snow_load_on_roof_kg:
                    Math.round(
                        snowLoad
                    ),

                snow_load_threshold_kg:
                    20000,

                snow_load_critical_threshold_kg:
                    25000,

                structural_integrity_percent:
                    round(
                        structuralIntegrity,
                        0
                    ),

                roof_strain_sensors:
                    "nominal",

                foundation_status:
                    "stable"
            },

            alerts_local: [],

            system_health_score:
                round(
                    structuralIntegrity,
                    0
                ),

            system_health_trend:
                snowLoad > 20000
                    ? "deteriorating"
                    : "stable"
        };
    };

const saveSimulationSnapshot =
    async (stationId) => {
        const state =
            getSimulationState(
                stationId
            );

        simulateEnvironment(
            state
        );

        simulateEnergy(
            state
        );

        simulateInfrastructure(
            state
        );

        const environmentDocument =
            buildEnvironmentDocument(
                state
            );

        const energyDocument =
            buildEnergyDocument(
                state
            );

        const infrastructureDocument =
            buildInfrastructureDocument(
                state
            );

        await Promise.all([
            Environment.create(
                environmentDocument
            ),

            Energy.create(
                energyDocument
            ),

            Infrastructure.create(
                infrastructureDocument
            )
        ]);

        await saveMasterAlertSnapshot(
            state.station_id
        );

        return {
            station_id:
                state.station_id,

            timestamp:
                new Date()
        };
    };

const startSimulation = async (
    stationId
) => {
    const normalizedStationId =
        stationId
            .trim()
            .toUpperCase();

    const station =
        await Station.findOne({
            code:
                normalizedStationId,
            isActive: true
        });

    if (!station) {
        throw new Error(
            "Station not found"
        );
    }

    if (
        simulationInterval
    ) {
        return {
            message:
                "Simulation is already running"
        };
    }

    simulationState[
        normalizedStationId
    ] =
        getInitialState(
            normalizedStationId
        );

    await saveSimulationSnapshot(
        normalizedStationId
    );

    simulationInterval =
        setInterval(
            async () => {
                try {
                    await saveSimulationSnapshot(
                        normalizedStationId
                    );

                    console.log(
                        `Simulation tick: ${normalizedStationId}`
                    );
                } catch (error) {
                    console.error(
                        "Simulation tick error:",
                        error.message
                    );
                }
            },
            TICK_RATE_SEC *
                1000
        );

    return {
        message:
            "Simulation started successfully",

        station_id:
            normalizedStationId,

        interval_seconds:
            TICK_RATE_SEC
    };
};

const stopSimulation = () => {
    if (
        !simulationInterval
    ) {
        return {
            message:
                "Simulation is not running"
        };
    }

    clearInterval(
        simulationInterval
    );

    simulationInterval =
        null;

    return {
        message:
            "Simulation stopped successfully"
    };
};

const getSimulationStatus =
    () => {
        return {
            running:
                Boolean(
                    simulationInterval
                ),

            tick_rate_seconds:
                TICK_RATE_SEC
        };
    };

export {
    startSimulation,
    stopSimulation,
    getSimulationStatus,
    saveSimulationSnapshot
};