// controllers/telemetryController.js
const { getLiveTelemetry } = require('../simulation/engine');

exports.getLiveStream = (req, res) => {
    try {
        const { stationId, section } = req.params; 
        const fullData = getLiveTelemetry(stationId);

        if (section) {
            // ALIAS: If the frontend asks for "alerts", we pull from the "health" engine state
            const targetSection = section === 'alerts' ? 'health' : section;

            if (fullData[targetSection]) {
                
                // --- THE ALERT & HEALTH PAYLOAD (Flattened to match your exact JSON) ---
                if (targetSection === 'health') {
                    return res.json({
                        status: "success",
                        data: {
                            station_id: fullData.station_id,
                            timestamp: fullData.timestamp,
                            ...fullData.health // Spreads active_alerts & station_health to the root!
                        }
                    });
                }

                // --- STANDARD SECTIONS (Energy, Environment, Infra - Nested normally) ---
                return res.json({
                    status: "success",
                    data: {
                        station_id: fullData.station_id,
                        timestamp: fullData.timestamp,
                        [section]: fullData[targetSection] 
                    }
                });
            }
        }

        // Fallback: Send the entire payload if no section is specified
        res.json({
            status: "success",
            data: fullData
        });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
};