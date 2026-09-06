import Alert from "../models/masterAlertModel.js";

import {
    emitAlertResolved
} from "../services/socket.service.js";


/*
 * Get all alerts
 */
const getAllAlerts = async (
    req,
    res
) => {
    try {
        const filter = {};

        /*
         * Station-based filtering
         */
        if (
            req.user.role !==
            "NCPOR Operator"
        ) {
            if (!req.user.station) {
                return res.status(403).json({
                    message:
                        "User is not assigned to any station"
                });
            }

            filter.station =
                req.user.station;
        }

        const alerts =
            await Alert.find(filter)
                .sort({
                    triggeredAt: -1
                })
                .populate(
                    "vehicle",
                    "vehicleNumber type status"
                )
                .populate(
                    "geofence",
                    "name type"
                )
                .populate(
                    "station",
                    "name code"
                );

        return res.status(200).json({
            message:
                "Alerts fetched successfully",

            count:
                alerts.length,

            alerts
        });

    } catch (error) {
        console.error(
            "Get all alerts error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch alerts",
            error:
                error.message
        });
    }
};


/*
 * Get active alerts
 */
const getActiveAlerts = async (
    req,
    res
) => {
    try {
        const filter = {
            isResolved: false
        };

        /*
         * Station filtering
         */
        if (
            req.user.role !==
            "NCPOR Operator"
        ) {
            if (!req.user.station) {
                return res.status(403).json({
                    message:
                        "User is not assigned to any station"
                });
            }

            filter.station =
                req.user.station;
        }

        const alerts =
            await Alert.find(filter)
                .sort({
                    triggeredAt: -1
                })
                .populate(
                    "vehicle",
                    "vehicleNumber type status"
                )
                .populate(
                    "geofence",
                    "name type"
                )
                .populate(
                    "station",
                    "name code"
                );

        return res.status(200).json({
            message:
                "Active alerts fetched successfully",

            count:
                alerts.length,

            alerts
        });

    } catch (error) {
        console.error(
            "Get active alerts error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch active alerts",
            error:
                error.message
        });
    }
};


/*
 * Get alert by ID
 */
const getAlertById = async (
    req,
    res
) => {
    try {
        const {
            id
        } = req.params;

        const alert =
            await Alert.findById(id)
                .populate(
                    "vehicle",
                    "vehicleNumber type status"
                )
                .populate(
                    "geofence",
                    "name type"
                )
                .populate(
                    "station",
                    "name code"
                );

        if (!alert) {
            return res.status(404).json({
                message:
                    "Alert not found"
            });
        }

        /*
         * Station authorization
         */
        if (
            req.user.role !==
            "NCPOR Operator"
        ) {
            if (
                !req.user.station ||
                req.user.station
                    .trim()
                    .toUpperCase() !==
                alert.station.code
                    .trim()
                    .toUpperCase()
            ) {
                return res.status(403).json({
                    message:
                        "You do not have access to this alert"
                });
            }
        }

        return res.status(200).json({
            message:
                "Alert fetched successfully",

            alert
        });

    } catch (error) {
        console.error(
            "Get alert by ID error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch alert",
            error:
                error.message
        });
    }
};


/*
 * Resolve alert
 */
const resolveAlert = async (
    req,
    res
) => {
    try {
        const {
            id
        } = req.params;

        const alert =
            await Alert.findById(id);

        if (!alert) {
            return res.status(404).json({
                message:
                    "Alert not found"
            });
        }

        /*
         * Station authorization
         */
        if (
            req.user.role !==
            "NCPOR Operator"
        ) {
            if (
                !req.user.station
            ) {
                return res.status(403).json({
                    message:
                        "User is not assigned to any station"
                });
            }

            /*
             * Fetch station through alert
             */
            const populatedStation =
                await Alert.findById(
                    alert._id
                ).populate(
                    "station",
                    "name code"
                );

            if (
                !populatedStation.station ||
                req.user.station
                    .trim()
                    .toUpperCase() !==
                populatedStation.station.code
                    .trim()
                    .toUpperCase()
            ) {
                return res.status(403).json({
                    message:
                        "You do not have access to this alert"
                });
            }
        }

        /*
         * Check if already resolved
         */
        if (alert.isResolved) {
            return res.status(400).json({
                message:
                    "Alert is already resolved"
            });
        }

        /*
         * Resolve alert
         */
        alert.isResolved =
            true;

        alert.resolvedAt =
            new Date();

        await alert.save();

        /*
         * Populate resolved alert
         */
        const populatedAlert =
            await Alert.findById(
                alert._id
            )
                .populate(
                    "vehicle",
                    "vehicleNumber type status"
                )
                .populate(
                    "geofence",
                    "name type"
                )
                .populate(
                    "station",
                    "name code"
                );

        /*
         * Emit real-time resolution
         */
        emitAlertResolved(
            populatedAlert.station.code,
            populatedAlert
        );

        return res.status(200).json({
            message:
                "Alert resolved successfully",

            alert:
                populatedAlert
        });

    } catch (error) {
        console.error(
            "Resolve alert error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to resolve alert",
            error:
                error.message
        });
    }
};


export {
    getAllAlerts,
    getActiveAlerts,
    getAlertById,
    resolveAlert
};