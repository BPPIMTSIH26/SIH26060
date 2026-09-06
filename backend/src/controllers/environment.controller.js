import Environment from "../models/environmentModel.js";
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

const createEnvironment =
    async (req, res) => {
        try {
            const {
                station,
                timestamp,
                pollingIntervalSeconds,
                exteriorConditions,
                weatherPhenomena,
                solarConditions,
                interconnectionsWithOtherSystems,
                emergencyScenarios,
                alertsLocal,
                systemHealthScore,
                overallWeatherRisk
            } = req.body || {};

            if (!station) {
                throw createError(
                    400,
                    "Station is required"
                );
            }

            const normalizedStation =
                station
                    .trim()
                    .toUpperCase();

            const stationData =
                await getStationByCode(
                    normalizedStation
                );

            if (
                req.user.role !==
                    "NCPOR Operator" &&
                !hasStationAccess(
                    req.user,
                    stationData.code
                )
            ) {
                throw createError(
                    403,
                    "You do not have access to this station"
                );
            }

            if (
                !exteriorConditions ||
                !exteriorConditions
                    .temperature ||
                !exteriorConditions.wind ||
                !exteriorConditions.visibility
            ) {
                throw createError(
                    400,
                    "Exterior environmental conditions are required"
                );
            }

            const environment =
                await Environment.create({
                    station:
                        stationData._id,

                    timestamp:
                        timestamp ||
                        new Date(),

                    pollingIntervalSeconds,

                    exteriorConditions,

                    weatherPhenomena,

                    solarConditions,

                    interconnectionsWithOtherSystems,

                    emergencyScenarios,

                    alertsLocal,

                    systemHealthScore,

                    overallWeatherRisk
                });

            const populatedEnvironment =
                await Environment.findById(
                    environment._id
                ).populate(
                    "station",
                    "name code"
                );

            return res.status(201).json({
                message:
                    "Environment data created successfully",

                environment:
                    populatedEnvironment
            });
        } catch (error) {
            console.error(
                "Create environment error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to create environment data"
            });
        }
    };

const getEnvironment =
    async (req, res) => {
        try {
            const {
                station
            } = req.query;

            if (
                station &&
                req.user.role !==
                    "NCPOR Operator" &&
                !hasStationAccess(
                    req.user,
                    station
                )
            ) {
                throw createError(
                    403,
                    "You do not have access to this station"
                );
            }

            const filter = {};

            if (station) {
                const normalizedStation =
                    station
                        .trim()
                        .toUpperCase();

                const stationData =
                    await getStationByCode(
                        normalizedStation
                    );

                filter.station =
                    stationData._id;
            } else if (
                req.user.role !==
                "NCPOR Operator"
            ) {
                const stationData =
                    await getStationByCode(
                        req.user.station
                            .trim()
                            .toUpperCase()
                    );

                filter.station =
                    stationData._id;
            }

            const environment =
                await Environment.findOne(
                    filter
                )
                    .sort({
                        timestamp: -1
                    })
                    .populate(
                        "station",
                        "name code"
                    );

            if (!environment) {
                throw createError(
                    404,
                    "Environment data not found"
                );
            }

            return res.status(200).json({
                message:
                    "Latest environment data fetched successfully",

                environment
            });
        } catch (error) {
            console.error(
                "Get environment error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to fetch environment data"
            });
        }
    };

const getEnvironmentHistory =
    async (req, res) => {
        try {
            const {
                station
            } = req.query;

            const filter = {};

            if (station) {
                const normalizedStation =
                    station
                        .trim()
                        .toUpperCase();

                const stationData =
                    await getStationByCode(
                        normalizedStation
                    );

                if (
                    !hasStationAccess(
                        req.user,
                        stationData.code
                    )
                ) {
                    throw createError(
                        403,
                        "You do not have access to this station"
                    );
                }

                filter.station =
                    stationData._id;
            } else if (
                req.user.role !==
                "NCPOR Operator"
            ) {
                const stationData =
                    await getStationByCode(
                        req.user.station
                            .trim()
                            .toUpperCase()
                    );

                filter.station =
                    stationData._id;
            }

            const environments =
                await Environment.find(
                    filter
                )
                    .sort({
                        timestamp: -1
                    })
                    .limit(100)
                    .populate(
                        "station",
                        "name code"
                    );

            return res.status(200).json({
                message:
                    "Environment history fetched successfully",

                count:
                    environments.length,

                environments
            });
        } catch (error) {
            console.error(
                "Get environment history error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to fetch environment history"
            });
        }
    };

const updateEnvironment =
    async (req, res) => {
        try {
            const {
                id
            } = req.params;

            const environment =
                await Environment.findById(
                    id
                ).populate(
                    "station",
                    "name code"
                );

            if (!environment) {
                throw createError(
                    404,
                    "Environment data not found"
                );
            }

            if (
                !hasStationAccess(
                    req.user,
                    environment.station.code
                )
            ) {
                throw createError(
                    403,
                    "You do not have access to this station"
                );
            }

            const allowedFields = [
                "timestamp",
                "pollingIntervalSeconds",
                "exteriorConditions",
                "weatherPhenomena",
                "solarConditions",
                "interconnectionsWithOtherSystems",
                "emergencyScenarios",
                "alertsLocal",
                "systemHealthScore",
                "overallWeatherRisk"
            ];

            let updated = false;

            for (
                const field of allowedFields
            ) {
                if (
                    req.body[field] !==
                    undefined
                ) {
                    environment[field] =
                        req.body[field];

                    updated = true;
                }
            }

            if (!updated) {
                throw createError(
                    400,
                    "No valid fields provided for update"
                );
            }

            await environment.save();

            const populatedEnvironment =
                await Environment.findById(
                    environment._id
                ).populate(
                    "station",
                    "name code"
                );

            return res.status(200).json({
                message:
                    "Environment data updated successfully",

                environment:
                    populatedEnvironment
            });
        } catch (error) {
            console.error(
                "Update environment error:",
                error
            );

            return res.status(
                error.statusCode || 500
            ).json({
                message:
                    error.message ||
                    "Failed to update environment data"
            });
        }
    };

export {
    createEnvironment,
    getEnvironment,
    getEnvironmentHistory,
    updateEnvironment
};