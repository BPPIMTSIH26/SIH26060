import { BASE_URL } from "../api/config";

const handleResponse = async (response, defaultMessage) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data?.message || defaultMessage);
    }

    return data;
};

export const energyAPI = {
    getStationEnergy: async (stationId) => {
        const query = stationId
            ? `?station_id=${encodeURIComponent(stationId)}`
            : "";

        const response = await fetch(
            `${BASE_URL}/energy${query}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const result = await handleResponse(
            response,
            "Failed to fetch energy data"
        );

        return {
            ...result,
            data: result?.data ?? null,
        };
    },

    getEnergyHistory: async (
        stationId,
        limit = 100
    ) => {
        const params = new URLSearchParams();

        if (stationId) {
            params.append(
                "station_id",
                stationId
            );
        }

        params.append("limit", String(limit));

        const response = await fetch(
            `${BASE_URL}/energy/history?${params.toString()}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const result = await handleResponse(
            response,
            "Failed to fetch energy history"
        );

        return {
            ...result,
            data: result?.energy ?? [],
        };
    },

    createEnergy: async (energyData) => {
        const response = await fetch(
            `${BASE_URL}/energy`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(
                    energyData
                ),
            }
        );

        const result = await handleResponse(
            response,
            "Failed to create energy data"
        );

        return {
            ...result,
            data: result?.data ?? null,
        };
    },

    updateEnergy: async (
        id,
        energyData
    ) => {
        const response = await fetch(
            `${BASE_URL}/energy/${encodeURIComponent(id)}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(
                    energyData
                ),
            }
        );

        const result = await handleResponse(
            response,
            "Failed to update energy data"
        );

        return {
            ...result,
            data: result?.data ?? null,
        };
    },
};