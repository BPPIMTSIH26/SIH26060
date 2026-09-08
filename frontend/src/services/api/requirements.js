import { BASE_URL } from "../api/config";

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

export const requirementsAPI = {
    /*
     * =========================================================
     * GET ALL REQUIREMENTS
     * Backend:
     * GET /api/v1/requirements?station_id=MAITRI
     *
     * Response:
     * {
     *   message,
     *   count,
     *   data: {
     *      requisitions: [...]
     *   }
     * }
     * =========================================================
     */
    getRequirements: async (stationId) => {
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
            `${BASE_URL}/requirements${
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
            "Failed to fetch requirements"
        );
    },

    /*
     * =========================================================
     * GET SINGLE REQUIREMENT
     * Backend:
     * GET /api/v1/requirements/:requirementNumber
     * =========================================================
     */
    getRequirement: async (
        requirementNumber
    ) => {
        if (!requirementNumber) {
            throw new Error(
                "Requirement number is required."
            );
        }

        const response = await fetch(
            `${BASE_URL}/requirements/${encodeURIComponent(
                requirementNumber
            )}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        return handleResponse(
            response,
            "Failed to fetch requirement"
        );
    },

    /*
     * =========================================================
     * CREATE REQUIREMENT
     *
     * Backend expects:
     * {
     *   item,
     *   qty,
     *   priority,
     *   category,
     *   notes
     * }
     *
     * Backend generates:
     * - requirementNumber
     * - title
     * - description
     * - quantity
     * - unit
     * - station
     * - createdBy
     * =========================================================
     */
    createRequirement: async (
        requirementData
    ) => {
        if (!requirementData) {
            throw new Error(
                "Requirement data is required."
            );
        }

        const payload = {
            item:
                requirementData.item
                    ?.trim(),

            qty: Number(
                requirementData.qty
            ),

            priority:
                requirementData.priority ||
                "MEDIUM",

            category:
                requirementData.category
                    ?.trim(),

            notes:
                requirementData.notes
                    ?.trim() || "",
        };

        if (!payload.item) {
            throw new Error(
                "Item description is required."
            );
        }

        if (
            !Number.isFinite(payload.qty) ||
            payload.qty < 1
        ) {
            throw new Error(
                "Quantity must be at least 1."
            );
        }

        if (!payload.category) {
            throw new Error(
                "Category is required."
            );
        }

        const response = await fetch(
            `${BASE_URL}/requirements`,
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
            "Failed to create requirement"
        );
    },

    /*
     * =========================================================
     * UPDATE REQUIREMENT STATUS
     *
     * Backend:
     * PATCH /requirements/:requirementNumber/status
     *
     * Allowed backend transitions:
     *
     * Logistics Manager:
     * PENDING    -> PROCESSING
     * PENDING    -> REJECTED
     * PROCESSING -> FULFILLED
     *
     * Station Manager:
     * PENDING -> CANCELLED
     *
     * extraData can contain:
     * {
     *   rejectionReason
     * }
     * =========================================================
     */
    updateStatus: async (
        requirementNumber,
        status,
        extraData = {}
    ) => {
        if (!requirementNumber) {
            throw new Error(
                "Requirement number is required."
            );
        }

        if (!status) {
            throw new Error(
                "Requirement status is required."
            );
        }

        const payload = {
            status:
                String(status)
                    .trim()
                    .toUpperCase(),
            ...extraData,
        };

        if (
            payload.rejectionReason !==
                undefined
        ) {
            payload.rejectionReason =
                String(
                    payload.rejectionReason
                ).trim();
        }

        const response = await fetch(
            `${BASE_URL}/requirements/${encodeURIComponent(
                requirementNumber
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
            "Failed to update requirement status"
        );
    },

    /*
     * =========================================================
     * DEACTIVATE REQUIREMENT
     *
     * Backend:
     * DELETE /requirements/:requirementNumber
     *
     * Backend permission:
     * Logistics Manager only.
     * =========================================================
     */
    deactivateRequirement: async (
        requirementNumber
    ) => {
        if (!requirementNumber) {
            throw new Error(
                "Requirement number is required."
            );
        }

        const response = await fetch(
            `${BASE_URL}/requirements/${encodeURIComponent(
                requirementNumber
            )}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        return handleResponse(
            response,
            "Failed to deactivate requirement"
        );
    },
};