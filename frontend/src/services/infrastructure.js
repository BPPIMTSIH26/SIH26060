import { USE_MOCK_API, BASE_URL, delay } from './config';
import mockInfraData from './data/infrastructure-data.json';

export const infrastructureAPI = {
    getStationInfrastructure: async (stationId) => {
        if (USE_MOCK_API) {
            await delay(700); // Simulate network load
            // Return JSON payload wrapped like your backend structure
            return { status: "success", data: mockInfraData };
        }

        // Real production fetch call
        const response = await fetch(`${BASE_URL}/station/${stationId}/infrastructure`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch infrastructure data");
        return data;
    }
};