import Requirement from "../models/requirementModel.js";
import Station from "../models/stationModel.js";

const createError = (
    statusCode,
    message
) => {
    const error = new Error(message);

    error.statusCode =
        statusCode;

    return error;
};

const getStationByCode = async (
    stationCode
) => {
    const station =
        await Station.findOne({
            code: stationCode,
            isActive: true
        });

    if (!station) {
        throw createError(
            404,
            "Station not found"
        );
    }

    return station;
};

const hasStationAccess = (
    user,
    stationCode
) => {
    if (
        user.role ===
        "NCPOR Operator"
    ) {
        return true;
    }

    if (!user.station) {
        return false;
    }

    return (
        user.station
            .trim()
            .toUpperCase() ===
        stationCode
            .trim()
            .toUpperCase()
    );
};


/*
    CREATE REQUIREMENT

    Station Manager only.
*/
const createRequirement =
    async (req, res) => {
        try {
            if (
                req.user.role !==
                "Station Manager"
            ) {
                throw createError(
                    403,
                    "Only Station Manager can create a requirement"
                );
            }

            if (!req.user.station) {
                throw createError(
                    403,
                    "User is not assigned to any station"
                );
            }

            const {
                requirementNumber,
                title,
                description,
                category,
                quantity,
                unit,
                priority
            } = req.body || {};

            if (
                !requirementNumber ||
                !title ||
                !category ||
                quantity === undefined
            ) {
                throw createError(
                    400,
                    "Requirement number, title, category and quantity are required"
                );
            }

            const normalizedRequirementNumber =
                requirementNumber
                    .trim()
                    .toUpperCase();

            const existingRequirement =
                await Requirement.findOne({
                    requirementNumber:
                        normalizedRequirementNumber
                });

            if (existingRequirement) {
                throw createError(
                    409,
                    "Requirement number already exists"
                );
            }

            const station =
                await getStationByCode(
                    req.user.station
                        .trim()
                        .toUpperCase()
                );

            const requirement =
                await Requirement.create({
                    requirementNumber:
                        normalizedRequirementNumber,

                    title:
                        title.trim(),

                    description:
                        description?.trim() ||
                        "",

                    category,

                    quantity,

                    unit,

                    station:
                        station._id,

                    priority:
                        priority || "MEDIUM",

                    status:
                        "PENDING",

                    createdBy:
                        req.user._id
                });

            const populatedRequirement =
                await Requirement.findById(
                    requirement._id
                )
                    .populate(
                        "station",
                        "name code"
                    )
                    .populate(
                        "createdBy",
                        "name email role station"
                    )
                    .populate(
                        "processedBy",
                        "name email role station"
                    );

            return res.status(201).json({
                message:
                    "Requirement created successfully",

                requirement:
                    populatedRequirement
            });
        } catch (error) {
            console.error(
                "Create requirement error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to create requirement"
            });
        }
    };


/*
    GET ALL REQUIREMENTS

    NCPOR Operator:
        All stations

    Station Manager:
        Own station

    Logistics Manager:
        All requirements
*/
const getRequirements =
    async (req, res) => {
        try {
            const filter = {
                isActive: true
            };

            if (
                req.user.role ===
                "Station Manager"
            ) {
                if (!req.user.station) {
                    throw createError(
                        403,
                        "User is not assigned to any station"
                    );
                }

                const station =
                    await getStationByCode(
                        req.user.station
                            .trim()
                            .toUpperCase()
                    );

                filter.station =
                    station._id;
            }

            const requirements =
                await Requirement.find(
                    filter
                )
                    .populate(
                        "station",
                        "name code"
                    )
                    .populate(
                        "createdBy",
                        "name email role station"
                    )
                    .populate(
                        "processedBy",
                        "name email role station"
                    )
                    .sort({
                        createdAt: -1
                    });

            return res.status(200).json({
                message:
                    "Requirements fetched successfully",

                count:
                    requirements.length,

                requirements
            });
        } catch (error) {
            console.error(
                "Get requirements error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to fetch requirements"
            });
        }
    };


/*
    GET REQUIREMENT BY NUMBER
*/
const getRequirementByNumber =
    async (req, res) => {
        try {
            const requirementNumber =
                req.params.requirementNumber
                    .trim()
                    .toUpperCase();

            const requirement =
                await Requirement.findOne({
                    requirementNumber,
                    isActive: true
                })
                    .populate(
                        "station",
                        "name code"
                    )
                    .populate(
                        "createdBy",
                        "name email role station"
                    )
                    .populate(
                        "processedBy",
                        "name email role station"
                    );

            if (!requirement) {
                throw createError(
                    404,
                    "Requirement not found"
                );
            }

            if (
                !hasStationAccess(
                    req.user,
                    requirement.station.code
                )
            ) {
                if (
                    req.user.role !==
                    "Logistics Manager"
                ) {
                    throw createError(
                        403,
                        "You do not have access to this requirement"
                    );
                }
            }

            return res.status(200).json({
                message:
                    "Requirement fetched successfully",

                requirement
            });
        } catch (error) {
            console.error(
                "Get requirement error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to fetch requirement"
            });
        }
    };


/*
    UPDATE REQUIREMENT STATUS

    Logistics Manager can:
        PENDING -> PROCESSING
        PROCESSING -> FULFILLED

    Logistics Manager can reject:
        PENDING -> REJECTED

    Station Manager can cancel:
        PENDING -> CANCELLED
*/
const updateRequirementStatus =
    async (req, res) => {
        try {
            const requirementNumber =
                req.params.requirementNumber
                    .trim()
                    .toUpperCase();

            const {
                status,
                rejectionReason
            } = req.body || {};

            const requirement =
                await Requirement.findOne({
                    requirementNumber,
                    isActive: true
                }).populate(
                    "station",
                    "name code"
                );

            if (!requirement) {
                throw createError(
                    404,
                    "Requirement not found"
                );
            }

            if (
                !hasStationAccess(
                    req.user,
                    requirement.station.code
                ) &&
                req.user.role !==
                    "Logistics Manager"
            ) {
                throw createError(
                    403,
                    "You do not have access to this requirement"
                );
            }


            /*
                Logistics workflow
            */
            if (
                req.user.role ===
                "Logistics Manager"
            ) {
                const validTransitions = {
                    PENDING: [
                        "PROCESSING",
                        "REJECTED"
                    ],

                    PROCESSING: [
                        "FULFILLED"
                    ],

                    FULFILLED: [],

                    REJECTED: [],

                    CANCELLED: []
                };

                if (
                    !validTransitions[
                        requirement.status
                    ]?.includes(status)
                ) {
                    throw createError(
                        400,
                        `Cannot change requirement status from ${requirement.status} to ${status}`
                    );
                }

                if (
                    status ===
                    "REJECTED"
                ) {
                    if (
                        !rejectionReason ||
                        !rejectionReason.trim()
                    ) {
                        throw createError(
                            400,
                            "Rejection reason is required"
                        );
                    }

                    requirement.rejectionReason =
                        rejectionReason.trim();
                }

                requirement.status =
                    status;

                requirement.processedBy =
                    req.user._id;

                requirement.processedAt =
                    new Date();

                if (
                    status ===
                    "FULFILLED"
                ) {
                    requirement.fulfilledAt =
                        new Date();
                }
            }


            /*
                Station Manager cancellation
            */
            else if (
                req.user.role ===
                "Station Manager"
            ) {
                if (
                    status !==
                    "CANCELLED"
                ) {
                    throw createError(
                        403,
                        "Station Manager can only cancel a requirement"
                    );
                }

                if (
                    requirement.status !==
                    "PENDING"
                ) {
                    throw createError(
                        400,
                        "Only pending requirements can be cancelled"
                    );
                }

                if (
                    !hasStationAccess(
                        req.user,
                        requirement.station.code
                    )
                ) {
                    throw createError(
                        403,
                        "You do not have access to this requirement"
                    );
                }

                requirement.status =
                    "CANCELLED";
            }

            else {
                throw createError(
                    403,
                    "You do not have permission to update this requirement"
                );
            }

            await requirement.save();

            const populatedRequirement =
                await Requirement.findById(
                    requirement._id
                )
                    .populate(
                        "station",
                        "name code"
                    )
                    .populate(
                        "createdBy",
                        "name email role station"
                    )
                    .populate(
                        "processedBy",
                        "name email role station"
                    );

            return res.status(200).json({
                message:
                    "Requirement status updated successfully",

                requirement:
                    populatedRequirement
            });
        } catch (error) {
            console.error(
                "Update requirement status error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to update requirement status"
            });
        }
    };


/*
    DEACTIVATE REQUIREMENT

    Station Manager can cancel through
    status endpoint.

    Here only Logistics Manager can
    deactivate a processed/old record.
*/
const deactivateRequirement =
    async (req, res) => {
        try {
            if (
                req.user.role !==
                "Logistics Manager"
            ) {
                throw createError(
                    403,
                    "Only Logistics Manager can deactivate a requirement"
                );
            }

            const requirementNumber =
                req.params.requirementNumber
                    .trim()
                    .toUpperCase();

            const requirement =
                await Requirement.findOne({
                    requirementNumber,
                    isActive: true
                }).populate(
                    "station",
                    "name code"
                );

            if (!requirement) {
                throw createError(
                    404,
                    "Requirement not found"
                );
            }

            if (
                requirement.status ===
                    "PROCESSING"
            ) {
                throw createError(
                    400,
                    "Requirement cannot be deactivated while processing"
                );
            }

            requirement.isActive =
                false;

            await requirement.save();

            return res.status(200).json({
                message:
                    "Requirement deactivated successfully"
            });
        } catch (error) {
            console.error(
                "Deactivate requirement error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to deactivate requirement"
            });
        }
    };

export {
    createRequirement,
    getRequirements,
    getRequirementByNumber,
    updateRequirementStatus,
    deactivateRequirement
};