import { USE_MOCK_API, BASE_URL, delay } from './config';
import mockAlertsData from './data/alerts-data.json';

export const alertsAPI = {
    getStationAlerts: async (stationId, options = {}) => {
        if (USE_MOCK_API) {
            await delay(500); 
            return { status: "success", data: mockAlertsData };
        }

        // FIXED: Pointing exactly to your new fastLane route!
        const response = await fetch(`${BASE_URL}/telemetry/${stationId}/alerts/live`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            signal: options.signal // FIXED: Enables cancellation for background polling
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch global alerts");
        
        return data;
    }
};