import { USE_MOCK_API, BASE_URL, delay } from './config';
import mockAlertsData from './data/alerts-data.json';

export const alertsAPI = {
    getStationAlerts: async (stationId) => {
        if (USE_MOCK_API) {
            await delay(500); 
            return { status: "success", data: mockAlertsData };
        }

        const response = await fetch(`${BASE_URL}/station/${stationId}/alerts`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch global alerts");
        return data;
    }
};