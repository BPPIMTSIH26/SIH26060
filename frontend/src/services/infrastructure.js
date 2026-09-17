import { USE_MOCK_API, BASE_URL, delay } from './config';
import mockInfraData from './data/infrastructure-data.json';

export const infrastructureAPI = {
    getStationInfrastructure: async (stationId, options = {}) => {
        if (USE_MOCK_API) {
            await delay(700); 
            return { status: "success", data: mockInfraData };
        }

        const response = await fetch(`${BASE_URL}/telemetry/${stationId}/infrastructure/live`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            signal: options.signal
        });
        
        const rawResponse = await response.json();
        if (!response.ok) throw new Error(rawResponse.message || "Failed to fetch infrastructure data");
        
        const fullTelemetry = rawResponse.data;

        // =====================================================================
        // THE ADAPTER: Format the massive backend dump into your EXACT schema
        // =====================================================================
        const formattedData = {
            station_id: fullTelemetry.station_id,
            station_name: fullTelemetry.station_name,
            timestamp: fullTelemetry.timestamp,
            polling_interval_seconds: fullTelemetry.polling_interval_seconds,
            
            // Extract ONLY the infrastructure pieces
            modules: fullTelemetry.infrastructure.modules,
            systems: fullTelemetry.infrastructure.systems,
            structural_health: fullTelemetry.infrastructure.structural_health,
            
            // Defaulting these if they aren't explicitly inside the infra object
            alerts_local: fullTelemetry.infrastructure.alerts_local || [],

            pressure_history: fullTelemetry.infrastructure.pressure_history || [],
            airlocks: fullTelemetry.infrastructure.airlocks || [],
            
            // Pull the specific infra health score from the main health object
            system_health_score: fullTelemetry.health?.station_health?.health_breakdown?.infrastructure_score || 96,
            system_health_trend: "stable"
        };

        // Return the perfectly formatted JSON to your React component
        return { status: "success", data: formattedData };
    }
};