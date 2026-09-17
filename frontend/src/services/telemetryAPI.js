// src/services/telemetryAPI.js
import { USE_MOCK_API, BASE_URL, delay } from './config';
// Optional: import a combined mock file if you have one

export const telemetryAPI = {
    getLiveTelemetry: async (stationId, options = {}) => {
        if (USE_MOCK_API) {
            await delay(700);
            // Replace with your combined mock data if needed
            return { status: "success", data: {} }; 
        }

        const response = await fetch(`${BASE_URL}/telemetry/${stationId}/live`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            signal: options.signal // <-- Enables request cancellation
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch telemetry data");
        return data;
    }
};