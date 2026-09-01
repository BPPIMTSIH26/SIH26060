import { USE_MOCK_API, BASE_URL, delay } from './config';
import mockEnergyData from './data/energy-data.json';

export const energyAPI = {
    getStationEnergy: async (stationId) => {
        if (USE_MOCK_API) {
            await delay(700); 
            return { status: "success", data: mockEnergyData };
        }

        const response = await fetch(`${BASE_URL}/station/${stationId}/energy`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch energy data");
        return data;
    }
};