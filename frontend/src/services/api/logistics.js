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

export const logisticsAPI = {
    /*
     * =========================================================
     * GET ALL LOGISTICS DATA
     *
     * Backend:
     * GET /api/v1/logistics
     * GET /api/v1/logistics?station_id=MAITRI
     *
     * Response:
     * {
     *   message,
     *   count,
     *   shipments: [...],
     *   data: {
     *      station_id,
     *      supplies,
     *      fuel_reserves,
     *      personnel,
     *      shipments,
     *      alerts_local,
     *      system_health_score,
     *      overall_logistics_status
     *   }
     * }
     * =========================================================
     */
    getStationLogistics: async (
        stationId
    ) => {
        const params = new URLSearchParams();

        if (stationId) {
            params.append(
                "station_id",
                stationId
                    .trim()
                    .toUpperCase()
            );
        }

        const query = params.toString();

        const response = await fetch(
            `${BASE_URL}/logistics${
                query
                    ? `?${query}`
                    : ""
            }`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        return handleResponse(
            response,
            "Failed to fetch logistics data"
        );
    },

    /*
     * =========================================================
     * GET SHIPMENT BY NUMBER
     *
     * Backend:
     * GET /api/v1/logistics/:shipmentNumber
     * =========================================================
     */
    getShipment: async (
        shipmentNumber
    ) => {
        if (!shipmentNumber) {
            throw new Error(
                "Shipment number is required."
            );
        }

        const response = await fetch(
            `${BASE_URL}/logistics/${encodeURIComponent(
                shipmentNumber
            )}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        return handleResponse(
            response,
            "Failed to fetch shipment"
        );
    },

    /*
     * =========================================================
     * CREATE SHIPMENT
     *
     * Backend:
     * POST /api/v1/logistics
     *
     * Backend expects:
     * {
     *   shipmentNumber,
     *   requirementNumber,
     *   title,
     *   description,
     *   category,
     *   quantity,
     *   unit
     * }
     *
     * Permission:
     * Logistics Manager only.
     * Requirement must be PROCESSING.
     * =========================================================
     */
    createShipment: async (
        shipmentData
    ) => {
        if (!shipmentData) {
            throw new Error(
                "Shipment data is required."
            );
        }

        const payload = {
            shipmentNumber:
                shipmentData.shipmentNumber
                    ?.trim()
                    .toUpperCase(),

            requirementNumber:
                shipmentData
                    .requirementNumber
                    ?.trim()
                    .toUpperCase(),

            title:
                shipmentData.title
                    ?.trim(),

            description:
                shipmentData.description
                    ?.trim() || "",

            category:
                shipmentData.category
                    ?.trim(),

            quantity: Number(
                shipmentData.quantity
            ),

            unit:
                shipmentData.unit
                    ?.trim() || "unit",
        };

        if (
            !payload.shipmentNumber ||
            !payload.requirementNumber ||
            !payload.title ||
            !payload.category
        ) {
            throw new Error(
                "Shipment number, requirement number, title and category are required."
            );
        }

        if (
            !Number.isFinite(
                payload.quantity
            ) ||
            payload.quantity < 1
        ) {
            throw new Error(
                "Shipment quantity must be at least 1."
            );
        }

        const response = await fetch(
            `${BASE_URL}/logistics`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                credentials: "include",
                body: JSON.stringify(
                    payload
                ),
            }
        );

        return handleResponse(
            response,
            "Failed to create shipment"
        );
    },

    /*
     * =========================================================
     * UPDATE SHIPMENT STATUS
     *
     * Backend:
     * PATCH /api/v1/logistics/:shipmentNumber/status
     *
     * Allowed:
     * PREPARING -> IN_TRANSIT
     * PREPARING -> CANCELLED
     * IN_TRANSIT -> ARRIVED
     * IN_TRANSIT -> CANCELLED
     *
     * Permission:
     * Logistics Manager only.
     * =========================================================
     */
    updateShipmentStatus: async (
        shipmentNumber,
        status
    ) => {
        if (!shipmentNumber) {
            throw new Error(
                "Shipment number is required."
            );
        }

        if (!status) {
            throw new Error(
                "Shipment status is required."
            );
        }

        const payload = {
            status:
                String(status)
                    .trim()
                    .toUpperCase(),
        };

        const response = await fetch(
            `${BASE_URL}/logistics/${encodeURIComponent(
                shipmentNumber
            )}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                credentials: "include",
                body: JSON.stringify(
                    payload
                ),
            }
        );

        return handleResponse(
            response,
            "Failed to update shipment status"
        );
    },

    /*
     * =========================================================
     * RECEIVE SHIPMENT
     *
     * Backend:
     * PATCH /api/v1/logistics/:shipmentNumber/receive
     *
     * Allowed:
     * ARRIVED -> RECEIVED
     *
     * Permission:
     * Station Manager only.
     * =========================================================
     */
    receiveShipment: async (
        shipmentNumber,
        receiptRemarks = ""
    ) => {
        if (!shipmentNumber) {
            throw new Error(
                "Shipment number is required."
            );
        }

        const payload = {
            receiptRemarks:
                String(
                    receiptRemarks || ""
                ).trim(),
        };

        const response = await fetch(
            `${BASE_URL}/logistics/${encodeURIComponent(
                shipmentNumber
            )}/receive`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                credentials: "include",
                body: JSON.stringify(
                    payload
                ),
            }
        );

        return handleResponse(
            response,
            "Failed to approve shipment receipt"
        );
    },

    /*
     * =========================================================
     * DEACTIVATE SHIPMENT
     *
     * Backend:
     * DELETE /api/v1/logistics/:shipmentNumber
     *
     * Permission:
     * Logistics Manager only.
     * =========================================================
     */
    deactivateShipment: async (
        shipmentNumber
    ) => {
        if (!shipmentNumber) {
            throw new Error(
                "Shipment number is required."
            );
        }

        const response = await fetch(
            `${BASE_URL}/logistics/${encodeURIComponent(
                shipmentNumber
            )}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        return handleResponse(
            response,
            "Failed to deactivate shipment"
        );
    },
};