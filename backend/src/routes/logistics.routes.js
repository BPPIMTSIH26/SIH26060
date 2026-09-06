import express from "express";

import {
    createShipment,
    getShipments,
    getShipmentByNumber,
    updateShipmentStatus,
    receiveShipment,
    deactivateShipment
} from "../controllers/logistics.controller.js";

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
    "/",
    authorizeRoles(
        "NCPOR Operator",
        "Station Manager",
        "Logistics Manager"
    ),
    getShipments
);

router.get(
    "/:shipmentNumber",
    authorizeRoles(
        "NCPOR Operator",
        "Station Manager",
        "Logistics Manager"
    ),
    getShipmentByNumber
);

router.post(
    "/",
    authorizeRoles(
        "Logistics Manager"
    ),
    createShipment
);

router.patch(
    "/:shipmentNumber/status",
    authorizeRoles(
        "Logistics Manager"
    ),
    updateShipmentStatus
);

router.patch(
    "/:shipmentNumber/receive",
    authorizeRoles(
        "Station Manager"
    ),
    receiveShipment
);

router.delete(
    "/:shipmentNumber",
    authorizeRoles(
        "Logistics Manager"
    ),
    deactivateShipment
);

export default router;