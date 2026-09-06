import express from "express";

import {
    startSimulationController,
    stopSimulationController,
    getSimulationStatusController,
    generateSimulationSnapshot
} from "../controllers/simulation.controller.js";

import {
    verifyJwt,
    authorizeRoles
} from "../middlewares/auth.middleware.js";

const router =
    express.Router();

router.use(
    verifyJwt
);

router.get(
    "/status",
    authorizeRoles(
        "NCPOR Operator",
        "Station Manager"
    ),
    getSimulationStatusController
);

router.post(
    "/start",
    authorizeRoles(
        "Station Manager"
    ),
    startSimulationController
);

router.post(
    "/stop",
    authorizeRoles(
        "Station Manager"
    ),
    stopSimulationController
);

router.post(
    "/snapshot",
    authorizeRoles(
        "Station Manager"
    ),
    generateSimulationSnapshot
);

export default router;