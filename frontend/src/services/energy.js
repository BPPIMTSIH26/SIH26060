import { USE_MOCK_API, BASE_URL, delay } from './config';
import mockEnergyData from './data/energy-data.json';

export const energyAPI = {
    getStationEnergy: async (stationId, options = {}) => {
        if (USE_MOCK_API) {
            await delay(700); 
            return { status: "success", data: mockEnergyData };
        }

        const response = await fetch(`${BASE_URL}/telemetry/${stationId}/energy/live`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            signal: options.signal
        });
        
        const rawResponse = await response.json();
        if (!response.ok) throw new Error(rawResponse.message || "Failed to fetch energy data");
        
        const fullTelemetry = rawResponse.data;
        const energyData = fullTelemetry.energy || {};

        // =====================================================================
        // THE ADAPTER: Format the backend dump into your EXACT schema
        // =====================================================================
        const formattedData = {
            station_id: fullTelemetry.station_id,
            timestamp: fullTelemetry.timestamp,
            polling_interval_seconds: fullTelemetry.polling_interval_seconds || 2,
            
            // Un-nest the specific energy pieces to the top level
            generators: energyData.generators,
            fuel_system: energyData.fuel_system,
            power_distribution: energyData.power_distribution,
            battery_system: energyData.battery_system,
            renewable_energy: energyData.renewable_energy,
            
            // Map the interconnections (if missing, calculate a fallback based on your schema)
            interconnections: energyData.interconnections || {
                critical_alert: energyData.power_distribution?.net_power_deficit_kw < 0 ? "POWER_DEFICIT_ACTIVE" : "NONE",
                alert_description: energyData.power_distribution?.net_power_deficit_kw < 0 
                    ? `Generation < Load. Battery depleting. Net deficit: ${energyData.power_distribution.net_power_deficit_kw.toFixed(2)} kW.` 
                    : "Grid stable.",
                recommended_action: "Activate Gen-2 or shed non-critical load",
                severity: energyData.power_distribution?.net_power_deficit_kw < 0 ? "WARNING" : "INFO"
            },
            
            // Pull the specific energy health score from the main health object
            system_health_score: fullTelemetry.health?.station_health?.health_breakdown?.energy_score || 78,
            system_health_trend: "deteriorating"
        };

        // Return the perfectly formatted JSON to your React component
        return { status: "success", data: formattedData };
    }
};