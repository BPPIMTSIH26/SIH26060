import { USE_MOCK_API, BASE_URL, delay } from './config';
import mockEnvData from './data/environment-data.json';

export const environmentAPI = {
    getStationEnvironment: async (stationId) => {
        if (USE_MOCK_API) {
            await delay(700); 
            return { status: "success", data: mockEnvData };
        }

        const response = await fetch(`${BASE_URL}/station/${stationId}/environment`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch environment data");
        return data;
    }
};