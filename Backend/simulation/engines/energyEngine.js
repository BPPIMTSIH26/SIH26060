// simulation/engines/energyEngine.js

exports.tick = (energyState) => {
    // --- B. Simulate Power Dynamics ---
    energyState.power_distribution.total_load_kw += (Math.random() - 0.5) * 3; // Load fluctuates
    let deficit = energyState.power_distribution.total_generation_kw - energyState.power_distribution.total_load_kw;
    energyState.power_distribution.net_power_deficit_kw = deficit;

    if (deficit < 0) {
        let drainRate = (Math.abs(deficit) / 100) * 0.15; 
        energyState.battery_system.current_charge_percent = Math.max(0, energyState.battery_system.current_charge_percent - drainRate);
        energyState.battery_system.performance.discharging_rate_kw = Math.abs(deficit);
        
        // Push Energy Interconnection Alerts!
        energyState.interconnections = {
            critical_alert: "POWER_DEFICIT_ACTIVE",
            alert_description: `Generation < Load. Battery depleting at ${Math.abs(deficit).toFixed(1)} kW.`,
            recommended_action: "Activate Gen-2 or shed non-critical load",
            severity: "WARNING"
        };
    } else {
        energyState.battery_system.performance.discharging_rate_kw = 0;
        energyState.interconnections = { critical_alert: "NONE", alert_description: "Grid stable.", recommended_action: "None", severity: "INFO" };
    }

    return energyState;
};