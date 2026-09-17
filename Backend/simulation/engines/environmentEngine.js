// simulation/engines/environmentEngine.js

exports.tick = (envState) => {
    envState.alerts_local = [];

    // --- A. Simulate Weather Fluctuation (Jitter) ---
    let windShift = (Math.random() - 0.5) * 6;
    let newWind = Math.max(0, envState.exterior_conditions.wind.wind_speed_kmh + windShift);
    envState.exterior_conditions.wind.wind_speed_kmh = newWind;
    envState.exterior_conditions.wind.wind_gust_kmh = newWind + (Math.random() * 15);
    
    let tempShift = (Math.random() - 0.5) * 0.4;
    envState.exterior_conditions.temperature.outside_temperature_c += tempShift;

    let vis = newWind > 80 ? Math.max(50, 5000 - (newWind * 40)) : 3200;
    envState.exterior_conditions.visibility.visibility_meters = vis;

    const isBlizzard = newWind > 90 && vis < 500;
    envState.weather_phenomena.blizzard.blizzard_active = isBlizzard;
    envState.weather_phenomena.blizzard.blizzard_warning = newWind > 75;

    if (isBlizzard) {
        envState.alerts_local.push({ severity: "critical", message: `BLIZZARD ACTIVE: Whiteout conditions. Wind: ${newWind.toFixed(1)} km/h. Outdoor ops locked down.` });
    } else if (newWind > 60) {
        envState.alerts_local.push({ severity: "warning", message: `High winds detected (${newWind.toFixed(1)} km/h). Secure outdoor equipment.` });
    }

    // --- B. NEW: Simulate Air Quality (Breathing) ---
    if (envState.air_quality) {
        envState.air_quality.forEach(aq => {
            aq.co2_ppm += (Math.random() - 0.5) * 5; // CO2 constantly fluctuates
            aq.co2_ppm = Math.max(400, Math.min(800, aq.co2_ppm)); // Clamp limits
            aq.status = aq.co2_ppm > 600 ? "warn" : "ok";
        });
    }

    // --- C. NEW: Live Chart Data Update ---
    if (envState.temperature_history) {
        // Update the very last entry in the array to represent "Right Now"
        const currentDataPoint = envState.temperature_history[envState.temperature_history.length - 1];
        currentDataPoint.ext = envState.exterior_conditions.temperature.outside_temperature_c;
        currentDataPoint.int += (Math.random() - 0.5) * 0.1; // Indoor temp naturally drifts
    }

    return envState;
};