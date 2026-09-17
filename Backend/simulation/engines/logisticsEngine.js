// simulation/engines/logisticsEngine.js

exports.tick = (logisticsState, energyState, personnelCount) => {
    const tickFractionOfHour = 2 / 3600;
    const tickFractionOfDay = 2 / 86400;

    // 1. FUEL BURN
    let fuelBurnedThisTick = 0;
    const gen1 = energyState?.generators?.gen_1?.operation;
    if (gen1 && energyState.generators.gen_1.status === "ACTIVE") {
        fuelBurnedThisTick += gen1.fuel_consumption_liters_per_hour * tickFractionOfHour;
    }
    const gen2 = energyState?.generators?.gen_2?.operation;
    if (gen2 && energyState.generators.gen_2.status === "ACTIVE") {
        fuelBurnedThisTick += gen2.fuel_consumption_liters_per_hour * tickFractionOfHour;
    }

    if (logisticsState.fuel_reserves && logisticsState.fuel_reserves.primary_tank) {
        let tank = logisticsState.fuel_reserves.primary_tank;
        tank.current_level_liters = Math.max(0, tank.current_level_liters - fuelBurnedThisTick);
        tank.current_level_percent = (tank.current_level_liters / tank.total_capacity_liters) * 100;
        
        const dailyBurnRate = (fuelBurnedThisTick / tickFractionOfDay); 
        tank.consumption_rate_liters_per_day = dailyBurnRate > 0 ? dailyBurnRate : 2040;
        tank.days_until_empty = tank.current_level_liters / tank.consumption_rate_liters_per_day;
    }

    // 2. FOOD BURN
    if (logisticsState.supplies && logisticsState.supplies.food) {
        let food = logisticsState.supplies.food;
        const dailyFoodConsumption = personnelCount * 2.5; 
        const foodBurnedThisTick = dailyFoodConsumption * tickFractionOfDay;

        food.current_stock_kg = Math.max(0, food.current_stock_kg - foodBurnedThisTick);
        food.current_stock_days = food.current_stock_kg / dailyFoodConsumption;
        
        if (food.current_stock_days < 14) food.status = "critical";
        else if (food.current_stock_days < 30) food.status = "low";
        else food.status = "adequate";
    }

    return logisticsState;
};