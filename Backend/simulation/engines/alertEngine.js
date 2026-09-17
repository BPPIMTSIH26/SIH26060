// simulation/engines/alertEngine.js

exports.evaluate = (state) => {
    const alerts = [];
    const now = new Date().toISOString();
    let score = 100;

    const { energy, environment, infrastructure, station_id } = state;

    // =========================================================================
    // 1. POWER DEFICIT ALERTS
    // =========================================================================
    const pwr = energy?.power_distribution || {};
    const deficit = pwr.net_power_deficit_kw ?? 0;
    const batt = energy?.battery_system || {};

    if (deficit < 0) {
        score -= 25;
        alerts.push({
            alert_id: `ALERT-${Date.now()}-${station_id}-PWR`,
            timestamp: now,
            severity: "CRITICAL",
            severity_levels: ["INFO", "WARNING", "CRITICAL"],
            severity_color: "red",
            trigger: "POWER_DEFICIT_ACTIVE",
            alert_message: `⚠️ POWER DEFICIT: Generation (${(pwr.total_generation_kw || 0).toFixed(1)} kW) < Load (${(pwr.total_load_kw || 0).toFixed(1)} kW). Battery depleting at ${Math.abs(deficit).toFixed(1)} kW deficit.`,
            affected_systems: ["energy", "battery_backup"],
            current_state: {
                power_generation_kw: Number((pwr.total_generation_kw || 0).toFixed(1)),
                power_load_kw: Number((pwr.total_load_kw || 0).toFixed(1)),
                deficit_kw: Number(deficit.toFixed(1)),
                battery_percent: Math.round(batt.current_charge_percent || 0),
                battery_depletion_rate_percent_per_hour: 25.7,
                battery_hours_remaining: 3.6
            },
            recommended_actions: [
                {
                    priority: 1,
                    action: "ACTIVATE_GEN_2",
                    description: "Activate Generator 2 to provide additional 250 kW capacity"
                },
                {
                    priority: 2,
                    action: "SHED_NON_ESSENTIAL_LOAD",
                    description: "Reduce non-critical lab operations to save load"
                },
                {
                    priority: 3,
                    action: "MONITOR_BATTERY",
                    description: "If no action taken, battery will reach critical state in 3.6 hours"
                }
            ],
            escalation: {
                escalates_to_critical_if: "Battery drops below 20% OR load exceeds generation for >10 minutes",
                time_until_escalation: "2.8 hours"
            }
        });
    }

    // =========================================================================
    // 2. WEATHER & BLIZZARD ALERTS
    // =========================================================================
    const ext = environment?.exterior_conditions || {};
    const wind = ext.wind || {};
    const vis = ext.visibility || {};
    const isBlizzard = environment?.weather_phenomena?.blizzard?.blizzard_active || false;

    if (isBlizzard) {
        score -= 20;
        alerts.push({
            alert_id: `ALERT-${Date.now()}-${station_id}-BLZ`,
            timestamp: now,
            severity: "CRITICAL",
            severity_levels: ["INFO", "WARNING", "CRITICAL"],
            severity_color: "red",
            trigger: "BLIZZARD_ACTIVE",
            alert_message: `⚠️ BLIZZARD ACTIVE: Wind ${(wind.wind_speed_kmh || 0).toFixed(1)} km/h, visibility ${vis.visibility_meters || 0}m. Complete operational lockdown.`,
            affected_systems: ["environment", "operations", "logistics"],
            current_state: {
                wind_speed_kmh: Number((wind.wind_speed_kmh || 0).toFixed(1)),
                visibility_meters: vis.visibility_meters || 0,
                temperature_c: Number((ext.temperature?.outside_temperature_c || 0).toFixed(1))
            },
            recommended_actions: [
                {
                    priority: 1,
                    action: "LOCKDOWN_STATION",
                    description: "Recall and account for all outdoor personnel immediately"
                },
                {
                    priority: 2,
                    action: "SEAL_AIRLOCKS",
                    description: "Switch HVAC to recirculation mode and secure external dampers"
                }
            ],
            escalation: {
                escalates_to_critical_if: "Wind exceeds 120 km/h or whiteout persists over 6 hours",
                time_until_escalation: "1.5 hours"
            }
        });
    } else if ((wind.wind_speed_kmh || 0) > 60) {
        score -= 5;
        alerts.push({
            alert_id: `ALERT-${Date.now()}-${station_id}-WND`,
            timestamp: now,
            severity: "WARNING",
            severity_levels: ["INFO", "WARNING", "CRITICAL"],
            severity_color: "yellow",
            trigger: "HIGH_WIND_WARNING",
            alert_message: `⚠️ HIGH WIND WATCH: Gusts reaching ${(wind.wind_gust_kmh || 0).toFixed(1)} km/h. Secure exterior equipment.`,
            affected_systems: ["environment", "operations"],
            current_state: {
                wind_speed_kmh: Number((wind.wind_speed_kmh || 0).toFixed(1)),
                wind_gust_kmh: Number((wind.wind_gust_kmh || 0).toFixed(1))
            },
            recommended_actions: [
                {
                    priority: 1,
                    action: "RESTRICT_FIELD_WORK",
                    description: "Limit outdoor movement to essential safety personnel only"
                }
            ]
        });
    }

    // =========================================================================
    // 3. FUEL RESERVES WATCH
    // =========================================================================
    const fuel = energy?.fuel_system?.primary_tank || {};
    if ((fuel.days_until_empty || 100) < 20) {
        score -= 5;
        alerts.push({
            alert_id: `ALERT-${Date.now()}-${station_id}-FUEL`,
            timestamp: now,
            severity: "WARNING",
            severity_levels: ["INFO", "WARNING", "CRITICAL"],
            severity_color: "yellow",
            trigger: "FUEL_DEPLETION_WARNING",
            alert_message: `⚠️ FUEL WATCH: Current fuel (${fuel.current_level_percent || 0}%) will last ~${Math.round(fuel.days_until_empty || 0)} days at current consumption rate.`,
            affected_systems: ["energy", "fuel_reserves"],
            current_state: {
                fuel_liters: fuel.current_level_liters || 0,
                fuel_percent: fuel.current_level_percent || 0,
                daily_consumption_liters: fuel.consumption_rate_liters_per_day || 2040,
                days_remaining: Number((fuel.days_until_empty || 0).toFixed(1)),
                critical_threshold_days: 5
            },
            recommended_actions: [
                {
                    priority: 1,
                    action: "SCHEDULE_FUEL_SHIPMENT",
                    description: "Coordinate next supply ship delivery date"
                },
                {
                    priority: 2,
                    action: "CONSIDER_EMERGENCY_AIRLIFT",
                    description: "Request emergency fuel airlift if resupply mission cannot be expedited"
                }
            ]
        });
    }

    // =========================================================================
    // 4. INFRASTRUCTURE & STRUCTURAL INTEGRITY
    // =========================================================================
    const struct = infrastructure?.structural_health || {};
    if ((struct.snow_load_on_roof_kg || 0) > 20000) {
        score -= 10;
        alerts.push({
            alert_id: `ALERT-${Date.now()}-${station_id}-ROOF`,
            timestamp: now,
            severity: "WARNING",
            severity_levels: ["INFO", "WARNING", "CRITICAL"],
            severity_color: "yellow",
            trigger: "ROOF_STRAIN_HIGH",
            alert_message: `⚠️ ROOF LOAD STRAIN: Snow accumulation exceeds 20,000 kg.`,
            affected_systems: ["infrastructure"],
            current_state: {
                snow_load_kg: struct.snow_load_on_roof_kg || 0,
                integrity_percent: struct.structural_integrity_percent || 0
            },
            recommended_actions: [
                {
                    priority: 1,
                    action: "CLEAR_ROOF_SNOW",
                    description: "Activate automated heating tracing or prepare mechanical snow-clearing"
                }
            ]
        });
    }

    // =========================================================================
    // 5. ASSEMBLE COMPLETE ROOT PAYLOAD
    // =========================================================================
    const finalScore = Math.max(0, Math.min(100, score));
    const operationalStatus = finalScore >= 85 ? "GREEN" : (finalScore >= 60 ? "YELLOW" : "RED");
    const trend = finalScore < 75 ? "deteriorating" : "stable";

    return {
        station_id: station_id,
        timestamp: now,
        station_health: {
            overall_health_score: finalScore,
            health_score_trend: trend,
            operational_status: operationalStatus,
            operational_status_values: ["GREEN", "YELLOW", "RED"],
            health_breakdown: {
                infrastructure_score: Math.round(struct.structural_integrity_percent || 95),
                energy_score: Math.max(0, Math.round(100 - (deficit < 0 ? 35 : 0))),
                environment_score: isBlizzard ? 40 : 92,
                logistics_score: 90,
                average_score: Math.round((95 + (100 - (deficit < 0 ? 35 : 0)) + (isBlizzard ? 40 : 92) + 90) / 4)
            }
        },
        active_alerts: alerts,
        emergency_scenarios: [
            {
                scenario_id: "SCENARIO-BLIZZARD",
                scenario_name: "Blizzard Lockdown",
                likelihood_percent: isBlizzard ? 100 : (wind.wind_speed_kmh > 60 ? 45 : 15),
                trigger_conditions: {
                    wind_speed_kmh: 100,
                    visibility_meters: 500,
                    duration_hours: "24+"
                },
                current_trigger_status: isBlizzard,
                current_wind: Number((wind.wind_speed_kmh || 0).toFixed(1)),
                current_visibility: vis.visibility_meters || 3200,
                projected_impact: {
                    outdoor_operations: isBlizzard ? "COMPLETE_LOCKDOWN" : "NORMAL",
                    personnel_movement: isBlizzard ? "RESTRICTED" : "NOMINAL",
                    supply_chain: isBlizzard ? "DISRUPTED" : "NOMINAL",
                    heating_demand_increase_percent: 40,
                    estimated_power_load_increase_kw: 35
                },
                recommended_prep_actions: [
                    "Ensure 48+ hours emergency fuel available",
                    "Secure all outdoor equipment",
                    "Recall field teams if wind approaches 75 kmh"
                ]
            },
            {
                scenario_id: "SCENARIO-GENERATOR_FAILURE",
                scenario_name: "Generator 1 Failure",
                likelihood_percent: 8,
                trigger_condition: "Gen-1 maintenance exceeds 5000 hours or fault detected",
                current_status: `GEN-1 at ${energy?.generators?.gen_1?.operation?.runtime_total_hours || 4250} hours`,
                projected_impact: {
                    immediate: "Power generation drops to 0 kW (Gen-2 must activate)",
                    battery_backup: "2.3 hours at current load",
                    critical_in: "2 hours if Gen-2 not activated"
                },
                mitigation: "Gen-2 standby ready. Activation time: <2 minutes"
            }
        ],
        interconnected_recommendations: {
            immediate_action: deficit < 0 
                ? "Activate Gen-2 to resolve power deficit and reduce battery depletion" 
                : "Grid operating nominal. Maintain standard monitoring protocol.",
            secondary_action: (fuel.days_until_empty || 0) < 20 
                ? "Schedule emergency fuel airlift if resupply cannot be expedited" 
                : "Review fuel consumption curves for next operational cycle.",
            monitoring: isBlizzard 
                ? "Blizzard active: enforce strict shelter-in-place order." 
                : "Track wind speeds closely. If approaching 75 kmh, prepare for blizzard lockdown."
        },
        decision_support_dashboard: {
            key_metrics: {
                fuel_days_remaining: Number((fuel.days_until_empty || 18.8).toFixed(1)),
                battery_hours_remaining: 3.6,
                food_days_remaining: 45,
                power_deficit_kw: Number(deficit.toFixed(1))
            },
            confidence_levels: {
                data_accuracy_percent: 95,
                model_reliability_percent: 88,
                recommendation_confidence_percent: 92
            }
        }
    };
};