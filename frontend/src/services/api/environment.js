import { BASE_URL } from "../api/config";

const handleResponse = async (response, defaultMessage) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data?.message || defaultMessage
        );
    }

    return data;
};

export const environmentAPI = {
    getStationEnvironment: async (
        stationId
    ) => {
        const query = stationId
            ? `?station=${encodeURIComponent(
                  stationId
              )}`
            : "";

        const response = await fetch(
            `${BASE_URL}/environment${query}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const result =
            await handleResponse(
                response,
                "Failed to fetch environment data"
            );

        return {
            ...result,
            data: result?.data ?? null,
            environment:
                result?.data ?? null,
        };
    },

    getEnvironmentHistory: async (
        stationId,
        limit = 100
    ) => {
        const params =
            new URLSearchParams();

        if (stationId) {
            params.append(
                "station",
                stationId
            );
        }

        params.append(
            "limit",
            String(limit)
        );

        const response = await fetch(
            `${BASE_URL}/environment/history?${params.toString()}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const result =
            await handleResponse(
                response,
                "Failed to fetch environment history"
            );

        return {
            ...result,
            data:
                result?.environments ??
                [],
        };
    },

    createEnvironment: async (
        environmentData
    ) => {
        const response = await fetch(
            `${BASE_URL}/environment`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                credentials: "include",
                body: JSON.stringify(
                    environmentData
                ),
            }
        );

        const result =
            await handleResponse(
                response,
                "Failed to create environment data"
            );

        return {
            ...result,
            data: result?.data ?? null,
        };
    },

    updateEnvironment: async (
        id,
        environmentData
    ) => {
        const response = await fetch(
            `${BASE_URL}/environment/${encodeURIComponent(
                id
            )}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                credentials: "include",
                body: JSON.stringify(
                    environmentData
                ),
            }
        );

        const result =
            await handleResponse(
                response,
                "Failed to update environment data"
            );

        return {
            ...result,
            data: result?.data ?? null,
        };
    },
};