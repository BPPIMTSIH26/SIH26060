import { BASE_URL } from "../api/config.js";

const handleResponse = async (
    response,
    defaultMessage
) => {
    const data = await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data?.message || defaultMessage
        );
    }

    return data;
};

export const alertsAPI = {
    getStationAlerts: async (stationId) => {
        const params = new URLSearchParams();

        if (stationId) {
            params.append(
                "station_id",
                stationId.trim().toUpperCase()
            );
        }

        const query = params.toString()
            ? `?${params.toString()}`
            : "";

        const response = await fetch(
            `${BASE_URL}/master-alerts${query}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const result = await handleResponse(
            response,
            "Failed to fetch station alerts"
        );

        /*
         * Backend response:
         *
         * {
         *   message: "...",
         *   masterAlert: {
         *      station_id,
         *      timestamp,
         *      station_health,
         *      active_alerts,
         *      ...
         *   }
         * }
         *
         * GlobalAlertContext expects:
         * result.data.active_alerts
         *
         * Therefore normalize the backend response here.
         */
        return {
            ...result,
            data: result?.masterAlert ?? null,
        };
    },
};