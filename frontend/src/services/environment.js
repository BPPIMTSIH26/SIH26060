import { USE_MOCK_API, BASE_URL, delay } from './config';
import mockEnvData from './data/environment-data.json';

export const environmentAPI = {
    getStationEnvironment: async (stationId, options = {}) => {
        if (USE_MOCK_API) {
            await delay(700); 
            return { status: "success", data: mockEnvData };
        }

        const response = await fetch(`${BASE_URL}/telemetry/${stationId}/environment/live`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            signal: options.signal
        });
        
        const rawResponse = await response.json();
        if (!response.ok) throw new Error(rawResponse.message || "Failed to fetch environment data");
        
        const fullTelemetry = rawResponse.data;
        const envData = fullTelemetry.environment || {};

        // =====================================================================
        // THE ADAPTER: Format the backend dump into your EXACT schema
        // =====================================================================
        const formattedData = {
            station_id: fullTelemetry.station_id,
            timestamp: fullTelemetry.timestamp,
            polling_interval_seconds: fullTelemetry.polling_interval_seconds || 2,
            
            // Un-nest the specific environment pieces to the top level
            exterior_conditions: envData.exterior_conditions,
            weather_phenomena: envData.weather_phenomena,
            solar_conditions: envData.solar_conditions,
            interconnections_with_other_systems: envData.interconnections_with_other_systems,
            
            // ---> NEW: Pass the backend-driven arrays through the adapter! <---
            air_quality: envData.air_quality || [],
            temperature_history: envData.temperature_history || [],
            
            // Add the emergency scenarios explicitly requested in your schema
            emergency_scenarios: {
                scenario_blizzard_lockdown: {
                    likelihood: envData.weather_phenomena?.blizzard?.blizzard_warning ? "high" : "low",
                    trigger_threshold_wind: 100,
                    trigger_threshold_visibility: 500,
                    current_status: envData.weather_phenomena?.blizzard?.blizzard_active ? "triggered" : "not_triggered",
                    estimated_effect: "Complete operational lockdown, field teams recalled"
                },
                scenario_extreme_cold: {
                    likelihood: envData.exterior_conditions?.temperature?.alerts?.is_warning_cold ? "medium" : "low",
                    trigger_threshold_temp: -50,
                    current_status: envData.exterior_conditions?.temperature?.alerts?.is_extreme_cold ? "triggered" : "not_triggered",
                    estimated_effect: "Increased heating demand, equipment stress"
                }
            },
            
            // Default empty alerts array if not present in the backend
            alerts_local: envData.alerts_local || [],
            
            // Pull the specific environment health score from the main health object
            system_health_score: fullTelemetry.health?.station_health?.health_breakdown?.environment_score || 92,
            
            // Calculate overall risk based on blizzard status
            overall_weather_risk: envData.weather_phenomena?.blizzard?.blizzard_active ? "high" : "low"
        };

        // Return the perfectly formatted JSON to your React component
        return { status: "success", data: formattedData };
    }
};