// controllers/orderController.js
const Order = require('../models/Order');
const engine = require('../simulation/engine'); // <-- Import the live engine!

// 1. Fetch Station-Specific Orders
exports.getStationOrders = async (req, res) => {
    try {
        const { stationId } = req.params;
        const orders = await Order.find({ station_id: stationId }).sort({ createdAt: -1 });
        res.json({ status: "success", data: orders });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 2. Submit a formal requisition
exports.createOrder = async (req, res) => {
    try {
        const { stationId } = req.params;
        const { item, category, qty, priority, notes } = req.body;
        const user = req.user;

        const prefix = stationId.toLowerCase() === 'maitri' ? 'MIT' : 'BHA';
        const orderId = `${prefix}-REQ-${Date.now().toString().slice(-6)}`;
        const initialStatus = user.role === 'authority' ? 'PENDING_LOGISTICS' : 'PENDING_AUTHORITY';

        const newOrder = await Order.create({
            order_id: orderId,
            station_id: stationId,
            item, category, qty, priority, notes,
            status: initialStatus,
            ordered_by: { 
                user_id: user._id, 
                name: user.fullName, 
                username: user.username,
                role: user.role 
            }
        });

        res.status(201).json({
            status: "success",
            message: initialStatus === 'PENDING_LOGISTICS' ? "Direct Override Authorized." : "Sent for approval.",
            data: newOrder
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 3. Higher Authority: Approve or Reject
exports.reviewOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { action, rejectionReason } = req.body; 
        const user = req.user;

        if (user.role !== 'authority') return res.status(403).json({ status: "error", message: "Unauthorized." });

        const order = await Order.findOne({ order_id: orderId });
        if (!order) return res.status(404).json({ status: "error", message: "Order not found." });

        if (action === 'approve') {
            order.status = 'PENDING_LOGISTICS';
            order.approval_details = { approved_by_name: user.fullName, username: user.username, timestamp: new Date() };
        } else if (action === 'reject') {
            order.status = 'REJECTED';
            order.approval_details = { approved_by_name: user.fullName, username: user.username, rejection_reason: rejectionReason, timestamp: new Date() };
        }

        await order.save();
        res.json({ status: "success", message: `Order ${action}d.`, data: order });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 4. Logistics Manager: Deliver Order -> Inject into Engine RAM
exports.deliverOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, productId, estimatedDeliveryDays } = req.body; 
        const user = req.user;

        if (user.role !== 'logistics') return res.status(403).json({ status: "error", message: "Unauthorized." });

        const order = await Order.findOne({ order_id: orderId });
        if (!order) return res.status(404).json({ status: "error", message: "Order not found." });

        order.status = status || 'DELIVERED';
        if (!order.logistics_details) order.logistics_details = {};
        order.logistics_details.handled_by_name = user.fullName;
        order.logistics_details.username = user.username;

        if (order.status === 'IN_TRANSIT') {
            order.logistics_details.in_transit_timestamp = new Date();
            if (estimatedDeliveryDays) order.logistics_details.estimated_delivery_days = estimatedDeliveryDays;
        } else if (order.status === 'DELIVERED') {
            order.logistics_details.product_id = productId;
            order.logistics_details.delivery_timestamp = new Date();
            
            // --- LIVE INJECTION TO SIMULATOR RAM ---
            engine.injectDelivery(order.station_id, order.category, order.qty, order.item, user.fullName);
        }

        await order.save();

        res.json({ status: "success", message: `Order updated to ${order.status}.`, data: order });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 5. Direct Inventory Log -> Inject into Engine RAM
exports.directInventoryLog = async (req, res) => {
    try {
        const { stationId } = req.params;
        const { item, category, qty } = req.body;
        const user = req.user;

        if (user.role !== 'logistics') return res.status(403).json({ status: "error", message: "Unauthorized." });

        // --- LIVE INJECTION TO SIMULATOR RAM ---
        engine.injectDelivery(stationId, category, qty, item, user.fullName);

        res.status(201).json({ status: "success", message: "Physical inventory numbers updated." });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};