const mongoose = require('mongoose');

const historicalSnapshotSchema = new mongoose.Schema({
    station_id: { type: String, required: true }, // "Maitri" or "Bharati"
    date: { type: String, required: true },       // Format: "YYYY-MM-DD"
    health_score: { type: Number, default: 100 },
    avg_generation_kw: { type: Number, default: 0 },
    avg_load_kw: { type: Number, default: 0 },
    fuel_remaining_liters: { type: Number, default: 0 },
    outside_temp_c: { type: Number, default: 0 },
    critical_alerts_count: { type: Number, default: 0 }
}, {
    timestamps: true
});

// Mongoose will create a collection named 'historicalsnapshots' in Atlas
module.exports = mongoose.model('HistoricalSnapshot', historicalSnapshotSchema);