import { USE_MOCK_API, BASE_URL, delay } from './config';
import mockLogisticsData from './data/logistics-data.json'; // Import the JSON file

export const logisticsAPI = {
    getStationLogistics: async (stationId) => {
        if (USE_MOCK_API) {
            await delay(800); // Simulate network latency for realism
            return { status: "success", data: mockLogisticsData };
        }

        // REAL API CALL (For when the backend is ready)
        const response = await fetch(`${BASE_URL}/station/${stationId}/logistics`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch logistics data");
        return data;
    }
};