# Advanced Telemetry Simulation Engine

## Overview
This simulation engine acts as the mathematical core of the Digital Twin. Instead of simply randomizing values, it calculates physical relationships (e.g., power deficits draining battery capacity over time, wind speeds reducing visibility) to feed the interconnected Master Alerts Engine.

---

## 1. Physical Simulation Matrix

| System Module | Parameter | Base Value | Fluctuation / Math Logic | Update Freq |
| :--- | :--- | :--- | :--- | :--- |
| **Environment** | `outside_temperature_c` | -35.2 °C | Random walk (±0.2°C/tick). Drops faster if wind > 80kmh. | 2 sec |
| **Environment** | `wind_speed_kmh` | 42.5 km/h | Gaussian noise (±2-5 km/h). Occasional wind gusts (+20 km/h). | 2 sec |
| **Environment** | `visibility_meters` | 3200 m | Inverse relationship to wind. If wind > 80, visibility drops rapidly. | 2 sec |
| **Energy** | `total_load_kw` | 245.5 kW | Base load + random noise (±5 kW). Increases if temp drops < -40°C. | 2 sec |
| **Energy** | `gen_1.power_output_kw`| 185.5 kW | Static while `ACTIVE`. Drops to 0 if `status` changes to `FAULT`. | 2 sec |
| **Energy** | `battery_charge_kwh` | 138.0 kWh | `current_charge - (power_deficit_kw * (tick_seconds / 3600))` | 2 sec |
| **Energy** | `fuel.current_level` | 38,250 L | `current_level - (gen_1.fuel_consumption_lph * (tick_seconds / 3600))` | 2 sec |
| **Infrastructure** | `indoor_temperature_c`| 18.5 °C | Stable if HVAC `nominal`. Drops 2°C per 10s if HVAC `fault`. | 5 sec |
| **Infrastructure** | `snow_load_on_roof_kg`| 15,000 kg | Increases by 50kg/tick ONLY IF `blizzard_warning` is true. | 5 sec |

---

## 2. Interconnected Event Triggers (Feeding the Master Engine)

The simulation engine evaluates these physical conditions continuously. When a threshold is breached, it updates the state, which the Master Alerts schema then formats for the frontend.

| Trigger Event | Mathematical Condition | Simulation Impact | Resulting Master Alert |
| :--- | :--- | :--- | :--- |
| **Battery Drain Cascade** | `total_load_kw > total_generation_kw` | Subtracts deficit from battery kWh. Updates `estimated_backup_hours`. | `POWER_DEFICIT_ACTIVE` (Warning -> Critical as battery % drops) |
| **Blizzard Generation** | `wind_speed_kmh > 100` AND `visibility < 500` | Sets `blizzard_active = true`. Accelerates `snow_load_on_roof_kg`. | `SCENARIO-BLIZZARD` |
| **HVAC Failure Risk** | `indoor_temperature_c < 10.0` | Modules transition to `status_color: "yellow"`. Occupancy risks logged. | `TEMP_CRITICAL_LOW` |
| **Critical Fuel Threshold** | `fuel.current_level_percent < 10` | Disables Gen-1. Switches `power_sourcing` to `emergency_reserve`. | `FUEL_DEPLETION_CRITICAL` |

---

## 3. Node.js Implementation Reference (`simulationEngine.js`)

```javascript
// simulationEngine.js
// Physical math simulation driving the SIH26060 Digital Twin

const TICK_RATE_SEC = 2; // Simulation runs every 2 seconds

// Master State Object (Mirrors your precise JSON schema structures)
let state = {
  energy: {
    gen_1: { status: "ACTIVE", output_kw: 185.5, consumption_lph: 85.0 },
    gen_2: { status: "STANDBY", output_kw: 0.0, consumption_lph: 0.0 },
    fuel: { capacity_l: 50000, current_l: 38250 },
    battery: { capacity_kwh: 150, current_kwh: 138 },
    distribution: { load_kw: 245.5, deficit_kw: -60.0 }
  },
  environment: {
    wind_kmh: 42.5,
    temp_c: -35.2,
    visibility_m: 3200,
    blizzard_active: false
  },
  infrastructure: {
    hvac_status: "nominal",
    lq_temp_c: 18.5,
    snow_load_kg: 15000
  }
};

function processSimulationTick() {
  // 1. ENVIRONMENT PHYSICS
  // Random wind fluctuations
  state.environment.wind_kmh += (Math.random() - 0.5) * 6;
  state.environment.wind_kmh = Math.max(5, state.environment.wind_kmh); 
  
  // Visibility degrades as wind increases
  if (state.environment.wind_kmh > 80) {
    state.environment.visibility_m = Math.max(100, state.environment.visibility_m - 200);
  } else {
    state.environment.visibility_m = Math.min(5000, state.environment.visibility_m + 50);
  }

  // Blizzard trigger
  state.environment.blizzard_active = (state.environment.wind_kmh > 100 && state.environment.visibility_m < 500);

  // 2. ENERGY PHYSICS
  // Fluctuate base load slightly
  state.energy.distribution.load_kw = 245.5 + (Math.random() - 0.5) * 10;
  
  // Calculate Deficit (Generation - Load)
  const total_gen = state.energy.gen_1.output_kw + state.energy.gen_2.output_kw;
  state.energy.distribution.deficit_kw = total_gen - state.energy.distribution.load_kw;

  // Drain Battery if in deficit (Convert kW to kWh for the 2-second tick)
  if (state.energy.distribution.deficit_kw < 0) {
    const drain_kwh = Math.abs(state.energy.distribution.deficit_kw) * (TICK_RATE_SEC / 3600);
    state.energy.battery.current_kwh -= drain_kwh;
    state.energy.battery.current_kwh = Math.max(0, state.energy.battery.current_kwh);
  }

  // Consume Fuel (Convert L/hr to L/tick)
  const fuel_burn = state.energy.gen_1.consumption_lph * (TICK_RATE_SEC / 3600);
  state.energy.fuel.current_l -= fuel_burn;

  // 3. INFRASTRUCTURE PHYSICS
  if (state.environment.blizzard_active) {
    state.infrastructure.snow_load_kg += 15; // Snow builds rapidly in blizzard
  }
  
  if (state.infrastructure.hvac_status === "fault") {
    state.infrastructure.lq_temp_c -= 0.1; // Temp drops if HVAC fails
  }

  return state;
}

module.exports = { processSimulationTick };
