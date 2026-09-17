// routes/orderRoutes.js
const express = require('express');
const router = express.Router();

const { 
    getStationOrders,
    createOrder, 
    reviewOrder, 
    deliverOrder,
    directInventoryLog 
} = require('../controllers/orderController');

const { protect, authorizeStationAccess } = require('../middleware/authMiddleware');

// 1. GET all orders for a specific station
router.get('/:stationId', protect, authorizeStationAccess, getStationOrders);

// 2. POST formal requisition
router.post('/:stationId/create', protect, authorizeStationAccess, createOrder);

// 3. PUT Authority approval/rejection
router.put('/:stationId/:orderId/review', protect, authorizeStationAccess, reviewOrder);

// 4. PUT Logistics delivery
router.put('/:stationId/:orderId/deliver', protect, authorizeStationAccess, deliverOrder);

// 5. POST Direct inventory bypass
router.post('/:stationId/direct-entry', protect, authorizeStationAccess, directInventoryLog);

module.exports = router;