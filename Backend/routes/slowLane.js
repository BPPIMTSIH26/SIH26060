// routes/slowLane.js
const express = require('express');
const router = express.Router();
const { getLogisticsStream } = require('../controllers/logisticsController');
const { protect, authorizeStationAccess } = require('../middleware/authMiddleware');


// 1. GET Logistics Data (Sliced - e.g., /api/logistics/Maitri/supplies/data)
router.get('/:stationId/:section/data', protect, authorizeStationAccess, getLogisticsStream);

// 2. GET Logistics Data (Full Payload - e.g., /api/logistics/Maitri/data)
router.get('/:stationId/data', protect, authorizeStationAccess, getLogisticsStream);

module.exports = router;