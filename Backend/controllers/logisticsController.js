// controllers/logisticsController.js
const engine = require('../simulation/engine');

exports.getLogisticsStream = async (req, res) => {
    try {
        const { stationId, section } = req.params;
        
        // 1. Pull the rich, perfectly nested JSON directly from the RAM simulation
        const fullData = engine.getLiveTelemetry(stationId);

        if (!fullData || !fullData.logistics) {
            return res.status(404).json({ 
                status: "error", 
                message: `Logistics data not initialized for ${stationId}.` 
            });
        }

        const logisticsData = fullData.logistics;
        logisticsData.last_updated = new Date().toISOString();

        // 2. If a specific sub-section is requested
        if (section && logisticsData[section]) {
            return res.json({
                status: "success",
                data: {
                    station_id: logisticsData.station_id,
                    last_updated: logisticsData.last_updated,
                    [section]: logisticsData[section]
                }
            });
        }

        // 3. Default: Send the complete nested structure your UI expects!
        res.json({ 
            status: "success", 
            data: logisticsData 
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};