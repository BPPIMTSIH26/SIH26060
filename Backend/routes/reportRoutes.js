const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware'); // Use your actual auth middleware

// GET /api/reports/:stationId?report_type=daily
router.get('/:stationId', protect, reportController.generateStationReport);

module.exports = router;