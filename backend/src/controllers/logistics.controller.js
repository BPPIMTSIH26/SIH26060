import Logistics from "../models/logisticsModel.js";
import Requirement from "../models/requirementModel.js";
import Station from "../models/stationModel.js";

const createError = (
    statusCode,
    message
) => {
    const error =
        new Error(message);

    error.statusCode =
        statusCode;

    return error;
};

const getStationByCode =
    async (stationCode) => {
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
    CREATE SHIPMENT

    Logistics Manager only.

    Requirement must be FULFILLED
    before a shipment is created.
*/
const createShipment =
    async (req, res) => {
        try {
            if (
                req.user.role !==
                "Logistics Manager"
            ) {
                throw createError(
                    403,
                    "Only Logistics Manager can create a shipment"
                );
            }

            if (!req.user.station) {
                throw createError(
                    403,
                    "User is not assigned to any station"
                );
            }

            const {
                shipmentNumber,
                requirementNumber,
                title,
                description,
                category,
                quantity,
                unit
            } = req.body || {};

            if (
                !shipmentNumber ||
                !requirementNumber ||
                !title ||
                !category ||
                quantity === undefined
            ) {
                throw createError(
                    400,
                    "Shipment number, requirement number, title, category and quantity are required"
                );
            }

            const normalizedShipmentNumber =
                shipmentNumber
                    .trim()
                    .toUpperCase();

            const normalizedRequirementNumber =
                requirementNumber
                    .trim()
                    .toUpperCase();

            const existingShipment =
                await Logistics.findOne({
                    shipmentNumber:
                        normalizedShipmentNumber
                });

            if (existingShipment) {
                throw createError(
                    409,
                    "Shipment number already exists"
                );
            }

            const requirement =
                await Requirement.findOne({
                    requirementNumber:
                        normalizedRequirementNumber,
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
                requirement.status !==
                "PROCESSING"
            ) {
                throw createError(
                    400,
                    "Shipment can only be created for a requirement in PROCESSING status"
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

            const shipment =
                await Logistics.create({
                    shipmentNumber:
                        normalizedShipmentNumber,

                    requirement:
                        requirement._id,

                    station:
                        requirement.station._id,

                    title:
                        title.trim(),

                    description:
                        description?.trim() ||
                        "",

                    category,

                    quantity,

                    unit,

                    status:
                        "PREPARING",

                    createdBy:
                        req.user._id
                });

            const populatedShipment =
                await Logistics.findById(
                    shipment._id
                )
                    .populate(
                        "requirement",
                        "requirementNumber title status"
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
                        "receivedBy",
                        "name email role station"
                    );

            return res.status(201).json({
                message:
                    "Shipment created successfully",

                shipment:
                    populatedShipment
            });
        } catch (error) {
            console.error(
                "Create shipment error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to create shipment"
            });
        }
    };


/*
    GET ALL SHIPMENTS
*/
const getShipments =
    async (req, res) => {
        try {
            const filter = {
                isActive: true
            };

            if (
                req.user.role !==
                "NCPOR Operator"
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

            const shipments =
                await Logistics.find(
                    filter
                )
                    .populate(
                        "requirement",
                        "requirementNumber title status"
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
                        "receivedBy",
                        "name email role station"
                    )
                    .sort({
                        createdAt: -1
                    });

            return res.status(200).json({
                message:
                    "Shipments fetched successfully",

                count:
                    shipments.length,

                shipments
            });
        } catch (error) {
            console.error(
                "Get shipments error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to fetch shipments"
            });
        }
    };


/*
    GET SHIPMENT BY NUMBER
*/
const getShipmentByNumber =
    async (req, res) => {
        try {
            const shipmentNumber =
                req.params.shipmentNumber
                    .trim()
                    .toUpperCase();

            const shipment =
                await Logistics.findOne({
                    shipmentNumber,
                    isActive: true
                })
                    .populate(
                        "requirement",
                        "requirementNumber title status"
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
                        "receivedBy",
                        "name email role station"
                    );

            if (!shipment) {
                throw createError(
                    404,
                    "Shipment not found"
                );
            }

            if (
                !hasStationAccess(
                    req.user,
                    shipment.station.code
                )
            ) {
                throw createError(
                    403,
                    "You do not have access to this shipment"
                );
            }

            return res.status(200).json({
                message:
                    "Shipment fetched successfully",

                shipment
            });
        } catch (error) {
            console.error(
                "Get shipment error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to fetch shipment"
            });
        }
    };


/*
    UPDATE SHIPMENT STATUS

    Logistics Manager:

    PREPARING -> IN_TRANSIT
    IN_TRANSIT -> ARRIVED
    Any applicable active state -> CANCELLED
*/
const updateShipmentStatus =
    async (req, res) => {
        try {
            const shipmentNumber =
                req.params.shipmentNumber
                    .trim()
                    .toUpperCase();

            const {
                status
            } = req.body || {};

            const shipment =
                await Logistics.findOne({
                    shipmentNumber,
                    isActive: true
                }).populate(
                    "station",
                    "name code"
                );

            if (!shipment) {
                throw createError(
                    404,
                    "Shipment not found"
                );
            }

            if (
                req.user.role !==
                "Logistics Manager"
            ) {
                throw createError(
                    403,
                    "Only Logistics Manager can update shipment status"
                );
            }

            if (
                !hasStationAccess(
                    req.user,
                    shipment.station.code
                )
            ) {
                throw createError(
                    403,
                    "You do not have access to this shipment"
                );
            }

            const validTransitions = {
                PREPARING: [
                    "IN_TRANSIT",
                    "CANCELLED"
                ],

                IN_TRANSIT: [
                    "ARRIVED",
                    "CANCELLED"
                ],

                ARRIVED: [],

                RECEIVED: [],

                CANCELLED: []
            };

            if (
                !validTransitions[
                    shipment.status
                ]?.includes(status)
            ) {
                throw createError(
                    400,
                    `Cannot change shipment status from ${shipment.status} to ${status}`
                );
            }

            shipment.status =
                status;

            if (
                status ===
                "IN_TRANSIT"
            ) {
                shipment.dispatchedAt =
                    new Date();
            }

            if (
                status ===
                "ARRIVED"
            ) {
                shipment.arrivedAt =
                    new Date();
            }

            await shipment.save();

            const populatedShipment =
                await Logistics.findById(
                    shipment._id
                )
                    .populate(
                        "requirement",
                        "requirementNumber title status"
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
                        "receivedBy",
                        "name email role station"
                    );

            return res.status(200).json({
                message:
                    "Shipment status updated successfully",

                shipment:
                    populatedShipment
            });
        } catch (error) {
            console.error(
                "Update shipment status error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to update shipment status"
            });
        }
    };


/*
    APPROVE / RECEIVE SHIPMENT

    Station Manager only.

    ARRIVED -> RECEIVED
*/
const receiveShipment =
    async (req, res) => {
        try {
            if (
                req.user.role !==
                "Station Manager"
            ) {
                throw createError(
                    403,
                    "Only Station Manager can approve shipment receipt"
                );
            }

            if (!req.user.station) {
                throw createError(
                    403,
                    "User is not assigned to any station"
                );
            }

            const shipmentNumber =
                req.params.shipmentNumber
                    .trim()
                    .toUpperCase();

            const {
                receiptRemarks
            } = req.body || {};

            const shipment =
                await Logistics.findOne({
                    shipmentNumber,
                    isActive: true
                }).populate(
                    "station",
                    "name code"
                );

            if (!shipment) {
                throw createError(
                    404,
                    "Shipment not found"
                );
            }

            if (
                !hasStationAccess(
                    req.user,
                    shipment.station.code
                )
            ) {
                throw createError(
                    403,
                    "You do not have access to this shipment"
                );
            }

            if (
                shipment.status !==
                "ARRIVED"
            ) {
                throw createError(
                    400,
                    "Only arrived shipments can be approved as received"
                );
            }

            shipment.status =
                "RECEIVED";

            shipment.receivedBy =
                req.user._id;

            shipment.receivedAt =
                new Date();

            shipment.receiptRemarks =
                receiptRemarks?.trim() ||
                "";

            await shipment.save();

            const populatedShipment =
                await Logistics.findById(
                    shipment._id
                )
                    .populate(
                        "requirement",
                        "requirementNumber title status"
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
                        "receivedBy",
                        "name email role station"
                    );

            return res.status(200).json({
                message:
                    "Shipment receipt approved successfully",

                shipment:
                    populatedShipment
            });
        } catch (error) {
            console.error(
                "Receive shipment error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to approve shipment receipt"
            });
        }
    };


/*
    DEACTIVATE SHIPMENT
*/
const deactivateShipment =
    async (req, res) => {
        try {
            if (
                req.user.role !==
                "Logistics Manager"
            ) {
                throw createError(
                    403,
                    "Only Logistics Manager can deactivate a shipment"
                );
            }

            const shipmentNumber =
                req.params.shipmentNumber
                    .trim()
                    .toUpperCase();

            const shipment =
                await Logistics.findOne({
                    shipmentNumber,
                    isActive: true
                }).populate(
                    "station",
                    "name code"
                );

            if (!shipment) {
                throw createError(
                    404,
                    "Shipment not found"
                );
            }

            if (
                !hasStationAccess(
                    req.user,
                    shipment.station.code
                )
            ) {
                throw createError(
                    403,
                    "You do not have access to this shipment"
                );
            }

            if (
                shipment.status ===
                    "IN_TRANSIT" ||
                shipment.status ===
                    "RECEIVED"
            ) {
                throw createError(
                    400,
                    "Shipment cannot be deactivated in its current status"
                );
            }

            shipment.isActive =
                false;

            await shipment.save();

            return res.status(200).json({
                message:
                    "Shipment deactivated successfully"
            });
        } catch (error) {
            console.error(
                "Deactivate shipment error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to deactivate shipment"
            });
        }
    };

export {
    createShipment,
    getShipments,
    getShipmentByNumber,
    updateShipmentStatus,
    receiveShipment,
    deactivateShipment
};