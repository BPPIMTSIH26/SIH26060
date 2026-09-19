const engine = require('../simulation/engine');
const HistoricalSnapshot = require('../models/HistoricalSnapshot');

exports.generateStationReport = async (req, res) => {
    try {
        const { stationId } = req.params;
        const reportType = req.query.report_type || 'daily';
        
        // 1. Snapshot the live engine state
        const state = engine.getLiveTelemetry(stationId);
        
        if (!state) {
            return res.status(404).json({ error: `Station ${stationId} offline or not found.` });
        }

        // 2. Fetch Historical Data from MongoDB for Trends
        let daysToFetch = 1;
        if (reportType === 'weekly') daysToFetch = 7;
        if (reportType === 'monthly') daysToFetch = 30;

        const historyLogs = await HistoricalSnapshot.find({ station_id: stationId })
            .sort({ date: -1 })
            .limit(daysToFetch);

        // 3. Extract active states and alerts
        const alerts = state.health?.alerts_local || [];
        const criticalAlerts = alerts.filter(a => a.severity === 'critical');
        const warningAlerts = alerts.filter(a => a.severity === 'warning');

        const energy = state.energy;
        const env = state.environment;
        const infra = state.infrastructure;
        const logistics = state.logistics;

        // 4. Construct Claude's full Report Data Schema
        const reportData = {
            report_id: `REPORT-${new Date().toISOString().split('T')[0]}-${Math.floor(100 + Math.random() * 900)}`,
            station_id: stationId,
            station_name: state.station_name,
            
            report_metadata: {
                report_type: reportType,
                generated_at: new Date().toISOString(),
                period_start: new Date(Date.now() - (daysToFetch * 86400000)).toISOString(),
                period_end: new Date().toISOString(),
                total_days: daysToFetch,
                generated_by: req.user ? req.user.fullName : "System",
                generated_for: req.user ? req.user.role : "Higher Authority"
            },

            executive_summary: {
                overall_health_score: logistics.system_health_score || 85,
                health_trend: "stable",
                operational_status: criticalAlerts.length > 0 ? "RED" : (warningAlerts.length > 0 ? "YELLOW" : "GREEN"),
                critical_alerts_count: criticalAlerts.length,
                warning_alerts_count: warningAlerts.length,
                info_alerts_count: alerts.length - (criticalAlerts.length + warningAlerts.length),
                key_highlights: [
                    `Power status: Generation ${energy.power_distribution.total_generation_kw} kW vs Load ${energy.power_distribution.total_load_kw} kW`,
                    `Fuel primary tank at ${energy.fuel_system.primary_tank.current_level_percent.toFixed(1)}% - ~${energy.fuel_system.primary_tank.days_until_empty.toFixed(1)} days remaining`,
                    `Infrastructure modules operational status nominal`
                ],
                recommended_actions: [
                    energy.power_distribution.net_power_deficit_kw < 0 ? "Activate Generator 2 or shed non-critical load" : "Monitor grid stability",
                    "Review incoming logistics shipments schedule",
                    "Maintain standard environmental safety protocols"
                ]
            },

            system_health_breakdown: {
                infrastructure_score: infra.structural_health.structural_integrity_percent,
                infrastructure_status: "GREEN",
                energy_score: energy.battery_system.current_charge_percent,
                energy_status: energy.power_distribution.net_power_deficit_kw < 0 ? "YELLOW" : "GREEN",
                environment_score: 95,
                environment_status: "GREEN",
                logistics_score: logistics.system_health_score,
                logistics_status: logistics.overall_logistics_status === "healthy" ? "GREEN" : "YELLOW"
            },

            alerts_log: {
                total_alerts: alerts.length,
                critical: criticalAlerts,
                warnings: warningAlerts
            },

            energy_analysis: {
                period: new Date().toISOString().split('T')[0],
                metrics: {
                    average_generation_kw: energy.power_distribution.total_generation_kw,
                    average_load_kw: energy.power_distribution.total_load_kw,
                    average_deficit_kw: energy.power_distribution.net_power_deficit_kw,
                    battery_start_percent: energy.battery_system.current_charge_percent,
                    battery_end_percent: energy.battery_system.current_charge_percent,
                    backup_hours_remaining: energy.battery_system.performance.estimated_backup_hours_at_current_load
                },
                fuel_status: {
                    start_liters: energy.fuel_system.primary_tank.current_level_liters,
                    end_liters: energy.fuel_system.primary_tank.current_level_liters,
                    fuel_remaining_days: energy.fuel_system.primary_tank.days_until_empty,
                    fuel_level_percent: energy.fuel_system.primary_tank.current_level_percent
                },
                generator_status: energy.generators
            },

            infrastructure_analysis: {
                period: new Date().toISOString().split('T')[0],
                modules: {
                    living_quarters: {
                        average_temperature_c: infra.modules.living_quarters.thermal_management.indoor_temperature_c,
                        status: infra.modules.living_quarters.status,
                        alerts: 0
                    },
                    main_lab: {
                        average_temperature_c: infra.modules.main_lab.thermal_management.indoor_temperature_c,
                        status: infra.modules.main_lab.status,
                        alerts: 0
                    },
                    storage: {
                        average_temperature_c: infra.modules.storage_module.thermal_management.indoor_temperature_c,
                        status: infra.modules.storage_module.status,
                        alerts: 0
                    }
                },
                hvac_system: infra.systems.hvac_main
            },

            environment_analysis: {
                period: new Date().toISOString().split('T')[0],
                metrics: {
                    average_temperature_c: env.exterior_conditions.temperature.outside_temperature_c,
                    wind_speed_kmh: env.exterior_conditions.wind.wind_speed_kmh,
                    visibility_meters: env.exterior_conditions.visibility.visibility_meters,
                    blizzard_active: env.weather_phenomena.blizzard.blizzard_active
                }
            },

            logistics_analysis: {
                supplies: {
                    food: logistics.supplies.food,
                    medical: logistics.supplies.medical,
                    fuel_emergency_reserve: logistics.fuel_reserves
                },
                personnel: logistics.personnel,
                incoming_shipments: logistics.shipments.incoming
            },

            recommendations: {
                immediate: [
                    energy.power_distribution.net_power_deficit_kw < 0 ? "Resolve power deficit immediately." : "Grid parameters stable."
                ],
                short_term: [
                    "Monitor meteorological trends for upcoming shifts.",
                    "Review inventory ledger for routine replenishment."
                ]
            },

            // 5. Attached MongoDB Trends
            trends: {
                historical_data: historyLogs.map(log => ({
                    date: log.date,
                    health_score: log.health_score,
                    fuel_consumed: log.fuel_remaining_liters,
                    avg_temp: log.outside_temp_c,
                    avg_generation_kw: log.avg_generation_kw,
                    avg_load_kw: log.avg_load_kw
                }))
            }
        };

        return res.status(200).json(reportData);

    } catch (error) {
        console.error("Comprehensive Report Generation Error:", error);
        return res.status(500).json({ error: "Failed to generate comprehensive report schema." });
    }
};