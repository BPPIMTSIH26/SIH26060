const authorizeStation = (req, res, next) => {
    try {
        // Authentication must happen before station authorization
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // Station code comes from the URL
        // Example: /api/v1/stations/MAITRI
        const requestedStation =
            req.params.code?.trim().toUpperCase();

        if (!requestedStation) {
            return res.status(400).json({
                message: "Station code is required"
            });
        }

        /*
            NCPOR Operator has global access.

            They can access:
                MAITRI
                BHARATI
                any future station
        */
        if (req.user.role === "NCPOR Operator") {
            return next();
        }

        /*
            Station Manager and Logistics Manager
            must have an assigned station.
        */
        if (!req.user.station) {
            return res.status(403).json({
                message: "User is not assigned to any station"
            });
        }

        /*
            Normalize the user's assigned station.
        */
        const userStation =
            req.user.station.trim().toUpperCase();

        /*
            Station-level authorization.

            Example:

            User:
                role = Station Manager
                station = MAITRI

            Requested:
                MAITRI

            Result:
                ✅ Access granted
        */
        if (userStation !== requestedStation) {
            return res.status(403).json({
                message:
                    "You do not have access to this station"
            });
        }

        next();

    } catch (error) {
        console.error(
            "Station authorization error:",
            error
        );

        return res.status(500).json({
            message: "Station authorization failed"
        });
    }
};

export default authorizeStation;