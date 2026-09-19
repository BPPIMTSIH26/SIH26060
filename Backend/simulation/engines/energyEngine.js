// simulation/engines/energyEngine.js

exports.tick = (energyState) => {
    // --- B. Simulate Power Dynamics ---
    energyState.power_distribution.total_load_kw += (Math.random() - 0.5) * 3; // Load fluctuates
    
    // Check if Gen 2 is active to boost total generation
    let activeGenCapacity = energyState.generators.gen_1.operation.power_output_kw;
    if (energyState.generators.gen_2 && energyState.generators.gen_2.status === "ACTIVE") {
        activeGenCapacity += energyState.generators.gen_2.operation.power_output_kw;
    }
    energyState.power_distribution.total_generation_kw = activeGenCapacity;

    let deficit = energyState.power_distribution.total_generation_kw - energyState.power_distribution.total_load_kw;
    energyState.power_distribution.net_power_deficit_kw = deficit;

    // --- SMART AUTO-MITIGATION ---
    // If deficit is severe and Gen 2 is currently in STANDBY, auto-activate it!
    if (deficit < -20 && energyState.generators.gen_2 && energyState.generators.gen_2.status === "STANDBY") {
        energyState.generators.gen_2.status = "ACTIVE";
        energyState.generators.gen_2.operation.power_output_kw = 250; // Bring Gen 2 online
        energyState.generators.gen_2.status_color = "green";
        console.log("[Auto-Mitigation] Power deficit detected. Generator 2 automatically activated.");
    }

    if (deficit < 0) {
        let drainRate = (Math.abs(deficit) / 100) * 0.05; // Slower, more realistic drain
        energyState.battery_system.current_charge_percent = Math.max(0, energyState.battery_system.current_charge_percent - drainRate);
        energyState.battery_system.performance.discharging_rate_kw = Math.abs(deficit);
        
        energyState.interconnections = {
            critical_alert: "POWER_DEFICIT_ACTIVE",
            alert_description: `Generation < Load. Battery depleting at ${Math.abs(deficit).toFixed(1)} kW.`,
            recommended_action: "Gen-2 supporting grid load",
            severity: "WARNING"
        };
    } else {
        // RECOVERY LOGIC: If generation exceeds load, slowly recharge the battery!
        let chargeRate = (deficit / 100) * 0.10;
        energyState.battery_system.current_charge_percent = Math.min(100, energyState.battery_system.current_charge_percent + chargeRate);
        
        energyState.battery_system.performance.discharging_rate_kw = 0;
        energyState.interconnections = { critical_alert: "NONE", alert_description: "Grid stable. Battery recharging.", recommended_action: "None", severity: "INFO" };
    }

    return energyState;
};