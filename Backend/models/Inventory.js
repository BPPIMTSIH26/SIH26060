// models/Inventory.js
const mongoose = require('mongoose');

const logisticsSchema = new mongoose.Schema({
    station_id: { type: String, required: true, unique: true }, 
    last_updated: { type: Date, default: Date.now },
    data_freshness_hours: { type: Number, default: 6 },
    
    // Core physical objects
    supplies: mongoose.Schema.Types.Mixed,
    fuel_reserves: mongoose.Schema.Types.Mixed,
    personnel: mongoose.Schema.Types.Mixed,
    shipments: mongoose.Schema.Types.Mixed,
    interdependencies: mongoose.Schema.Types.Mixed,
    alerts_local: mongoose.Schema.Types.Mixed,
    
    system_health_score: { type: Number, default: 92 },
    overall_logistics_status: { type: String, default: "healthy" },

    // DYNAMIC INVENTORY TABLE
    inventory_ledger: mongoose.Schema.Types.Mixed,

    // RECENT DELIVERIES LOG
    recent_deliveries: [{
        item: String,
        category: String,
        qty: Number,
        delivered_by: String,
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Inventory', logisticsSchema);