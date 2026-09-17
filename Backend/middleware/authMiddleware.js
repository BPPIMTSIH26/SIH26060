// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // <-- We need to import the User model!

exports.protect = async (req, res, next) => { // <-- Make this function async
    // Grab the token from the cookies
    const token = req.cookies.polar_jwt;

    if (!token) {
        return res.status(401).json({ status: "error", message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // THE FIX: Fetch the full user document from the database (excluding the password)
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ status: "error", message: "User no longer exists" });
        }

        next();
    } catch (error) {
        res.status(401).json({ status: "error", message: "Not authorized, token failed" });
    }
};

exports.authorizeStationAccess = (req, res, next) => {
    const user = req.user;
    const requestedStation = req.params.stationId;

    // 1. High Authority and Logistics Officers get global access to BOTH stations
    if (user.role === 'authority' || user.role === 'logistics') {
        return next(); 
    }

    // 2. Station Masters are strictly restricted to their assigned station only
    if (user.role === 'station_master') {
        if (!user.station || user.station !== requestedStation) {
            return res.status(403).json({ 
                status: "error", 
                message: `Clearance Denied: Station Master clearance is restricted to ${user.station || 'unassigned'}. Access to ${requestedStation} is prohibited.` 
            });
        }
        return next();
    }

    // 3. Default fallback for any unrecognized roles
    return res.status(403).json({ 
        status: "error", 
        message: "Clearance Denied: Unrecognized operational role." 
    });
};