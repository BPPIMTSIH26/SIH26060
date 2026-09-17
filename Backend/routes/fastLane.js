// routes/fastLane.js
const express = require('express');
const router = express.Router();
const { getLiveStream } = require('../controllers/telemetryController');

// Import both middlewares
const { protect, authorizeStationAccess } = require('../middleware/authMiddleware');

// Apply the authorization check AFTER the protect check
router.get('/:stationId/:section/live', protect, authorizeStationAccess, getLiveStream);
router.get('/:stationId/live', protect, authorizeStationAccess, getLiveStream);

module.exports = router;