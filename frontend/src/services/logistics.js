import { USE_MOCK_API, BASE_URL, delay } from './config';
import mockLogisticsData from './data/logistics-data.json';

export const logisticsAPI = {
    getStationLogistics: async (stationId, options = {}) => {
        // If config is false, this block is skipped entirely
        if (USE_MOCK_API) {
            await delay(800);
            return { status: "success", data: mockLogisticsData };
        }

        const response = await fetch(`${BASE_URL}/logistics/${stationId}/data`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            signal: options.signal
        });
        
        const rawResponse = await response.json();
        if (!response.ok) throw new Error(rawResponse.message || "Failed to fetch logistics data");
        
        // Pass the pure backend data directly to the UI
        return { status: "success", data: rawResponse.data };
    }
};