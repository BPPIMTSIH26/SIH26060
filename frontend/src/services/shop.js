import { USE_MOCK_API, BASE_URL, delay } from './config';
import mockShopData from './data/shop-data.json';

export const shopAPI = {
    getRequisitions: async (stationId) => {
        if (USE_MOCK_API) {
            await delay(600); // Simulate network latency
            
            // DYNAMIC FIX: Inject the station prefix into the IDs so we can visually see the data change
            const prefix = stationId.substring(0, 3).toUpperCase();
            
            const dynamicData = mockShopData.requisitions.map(req => ({
                ...req,
                id: `${req.id}-${prefix}` // Outputs REQ-101-MAI or REQ-101-BHA
            }));

            return { status: "success", data: { requisitions: dynamicData } };
        }

        const response = await fetch(`${BASE_URL}/station/${stationId}/requisitions`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch requisitions");
        return data;
    }
};