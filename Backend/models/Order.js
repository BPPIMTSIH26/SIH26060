// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_id: { type: String, required: true, unique: true }, 
    station_id: { type: String, required: true },
    
    item: { type: String, required: true },
    category: { type: String, required: true },
    qty: { type: Number, required: true },
    priority: { type: String, required: true },
    notes: { type: String, default: "" },

    status: { 
        type: String, 
        enum: ['PENDING_AUTHORITY', 'REJECTED', 'PENDING_LOGISTICS', 'IN_TRANSIT', 'DELIVERED'],
        default: 'PENDING_AUTHORITY'
    },

    // Phase 1: Ordered By
    ordered_by: {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        username: { type: String }, // <-- NEW
        role: { type: String },
        timestamp: { type: Date, default: Date.now }
    },
    
    // Phase 2: Approved / Rejected By
    approval_details: {
        approved_by_name: { type: String },
        username: { type: String }, // <-- NEW
        rejection_reason: { type: String },
        timestamp: { type: Date }
    },

    // Phase 3: Handled By Logistics
    logistics_details: {
        handled_by_name: { type: String },
        username: { type: String }, // <-- NEW
        in_transit_timestamp: { type: Date }, // <-- NEW: When it shipped
        estimated_delivery_days: { type: Number }, // <-- NEW: ETA
        product_id: { type: String }, 
        expiry_date: { type: Date },  
        delivery_timestamp: { type: Date }
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);