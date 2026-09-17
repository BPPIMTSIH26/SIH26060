// simulation/engines/infraEngine.js

exports.tick = (infraState, envState, energyState) => {
    // 1. Reset local alerts
    infraState.alerts_local = [];

    // 2. HVAC & Thermal Physics
    const deficit = energyState.power_distribution.net_power_deficit_kw;
    const outTemp = envState.exterior_conditions.temperature.outside_temperature_c;
    
    let indoorShift = (Math.random() - 0.5) * 0.1;
    if (deficit < -50) indoorShift -= 0.2; 
    
    let currentTemp = infraState.modules.living_quarters.thermal_management.indoor_temperature_c;
    currentTemp = Math.max(outTemp, currentTemp + indoorShift); 
    infraState.modules.living_quarters.thermal_management.indoor_temperature_c = currentTemp;

    infraState.systems.hvac_main.performance.air_circulation_cfm += (Math.random() - 0.5) * 50;

    // 3. Structural Alerts
    const snowLoad = infraState.structural_health.snow_load_on_roof_kg;
    if (snowLoad > 20000) {
        infraState.alerts_local.push({ severity: "critical", message: `CRITICAL SNOW LOAD: ${snowLoad} kg. Roof structural integrity at risk.` });
    } else if (snowLoad > 15000) {
        infraState.alerts_local.push({ severity: "warning", message: `High snow load detected (${snowLoad} kg). Clearance recommended.` });
    }

    if (currentTemp < 10) {
        infraState.alerts_local.push({ severity: "critical", message: `CRITICAL TEMP: Living quarters dropped to ${currentTemp.toFixed(1)}°C.` });
    }

    // --- 4. NEW: Simulate Pressure Chart Data ---
    if (infraState.pressure_history) {
        const currentDataPoint = infraState.pressure_history[infraState.pressure_history.length - 1];
        // Pressure shifts slightly based on snow weight
        const basePressure = 1.1 + (snowLoad / 100000);
        currentDataPoint.pressure = basePressure + (Math.random() - 0.5) * 0.05;
    }

    // --- 5. NEW: Simulate Airlock Wear & Tear ---
    if (infraState.airlocks) {
        infraState.airlocks.forEach(al => {
            // Micro-fluctuations in airlock seals
            al.pressureDrop_psi = Math.max(0, al.pressureDrop_psi + (Math.random() - 0.5) * 0.002);
            
            // Sync status with module safety
            if (al.id === "AL-LivingQtrs") al.status = infraState.modules.living_quarters.safety.emergency_exits_clear ? "secure" : "warn";
            if (al.id === "AL-MainLab") al.status = infraState.modules.main_lab.safety.chemical_storage_secure ? "secure" : "warn";
        });
    }

    return infraState;
};