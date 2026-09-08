import { BASE_URL } from "../api/config";

const handleResponse = async (
    response,
    defaultMessage
) => {
    const data =
        await response
            .json()
            .catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data?.message ||
                defaultMessage
        );
    }

    return data;
};

export const infrastructureAPI = {
    getStationInfrastructure: async (
        stationId
    ) => {
        const query = stationId
            ? `?station_id=${encodeURIComponent(
                  stationId
              )}`
            : "";

        const response =
            await fetch(
                `${BASE_URL}/infrastructure${query}`,
                {
                    method: "GET",
                    credentials:
                        "include",
                }
            );

        const result =
            await handleResponse(
                response,
                "Failed to fetch infrastructure data"
            );

        return {
            ...result,
            data:
                result?.data ??
                null,
        };
    },

    getInfrastructureHistory: async (
        stationId,
        limit = 100
    ) => {
        const params =
            new URLSearchParams();

        if (stationId) {
            params.append(
                "station_id",
                stationId
            );
        }

        params.append(
            "limit",
            String(limit)
        );

        const response =
            await fetch(
                `${BASE_URL}/infrastructure/history?${params.toString()}`,
                {
                    method: "GET",
                    credentials:
                        "include",
                }
            );

        const result =
            await handleResponse(
                response,
                "Failed to fetch infrastructure history"
            );

        return {
            ...result,
            data:
                result?.infrastructure ??
                [],
        };
    },

    createInfrastructure: async (
        infrastructureData
    ) => {
        const response =
            await fetch(
                `${BASE_URL}/infrastructure`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    credentials:
                        "include",
                    body: JSON.stringify(
                        infrastructureData
                    ),
                }
            );

        const result =
            await handleResponse(
                response,
                "Failed to create infrastructure data"
            );

        return {
            ...result,
            data:
                result?.data ??
                null,
        };
    },

    updateInfrastructure: async (
        id,
        infrastructureData
    ) => {
        const response =
            await fetch(
                `${BASE_URL}/infrastructure/${encodeURIComponent(
                    id
                )}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    credentials:
                        "include",
                    body: JSON.stringify(
                        infrastructureData
                    ),
                }
            );

        const result =
            await handleResponse(
                response,
                "Failed to update infrastructure data"
            );

        return {
            ...result,
            data:
                result?.data ??
                null,
        };
    },
};