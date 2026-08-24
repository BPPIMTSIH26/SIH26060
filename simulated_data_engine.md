# Simulated Data Engine Specification

## Overview
Because physical access to hardware at Maitri and Bharati stations is unavailable, the backend incorporates a high-fidelity **Telemetry Simulation Engine**. This engine generates realistic continuous data streams, models natural polar weather variations, and triggers emergency stress scenarios.

---

## 1. Simulation Parameters & Frequency Matrix

| Pillar | Parameter | Base / Normal Value | Fluctuation / Range | Update Frequency | Simulation Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Environment** | `outside_temperature_c` | -35.0 °C | -15.0 °C to -60.0 °C (±0.5°C step) | Every 2 sec | Random Walk Algorithm |
| **Environment** | `wind_speed_kmh` | 40.0 km/h | 10.0 to 140.0 km/h (±3.0 km/h step) | Every 1 sec | Gaussian Noise |
| **Environment** | `visibility_meters` | 3500 m | 100 m (Whiteout) to 5000 m | Every 5 sec | Inverse to Wind Speed |
| **Energy** | `power_load_kw` | 245.0 kW | 200.0 kW to 290.0 kW (±5.0 kW step) | Every 1 sec | Sinusoidal + Noise |
| **Energy** | `fuel_level_percent` | 76.5% | Decrements by 0.001% per cycle | Every 5 sec | Linear Decay |
| **Energy** | `generator_1_status` | `ACTIVE` | `ACTIVE` / `STANDBY` / `FAULT` | On Event | State Machine |
| **Infrastructure** | `indoor_temperature_c` | 18.5 °C | 15.0 °C to 22.0 °C (±0.1°C step) | Every 5 sec | Tied to HVAC State |
| **Infrastructure** | `hvac_status` | `NOMINAL` | `NOMINAL` / `DEGRADED` / `FAULT` | On Event | Threshold Dependent |
| **Logistics** | `food_supply_days` | 45 Days | Decrements by 1 every 24 hrs | Daily Log | Step Function |

---

## 2. Disaster & Emergency Simulation Scenarios

| Scenario ID | Trigger Condition | Parameter Impact | Automated System Response |
| :--- | :--- | :--- | :--- |
| **SCN-01: Severe Blizzard** | `wind_speed_kmh > 100` AND `visibility_meters < 500` | `blizzard_warning` set to `true` | Triggers **CRITICAL ALERT** banner on frontend; logs field recall protocol. |
| **SCN-02: Generator Failure** | `generator_1_status == "FAULT"` | `power_load` drops to battery bank; `battery_level` decays rapidly | Autoswitches `generator_2` to `ACTIVE`; alerts station engineer in India. |
| **SCN-03: Heating Failure** | `hvac_status == "FAULT"` | `indoor_temperature_c` drops by 1.5°C per minute | Highlights affected station module in **FLASHING RED** on the 2D SVG blueprint. |
| **SCN-04: Critical Fuel Shortage** | `fuel_level_percent < 25%` | `health_score` drops below 60 | Triggers emergency logistics alert requesting priority resupply scheduling. |

---

## 3. Backend Implementation Reference (`simulationEngine.js`)

```javascript
// simulationEngine.js - Copy/Paste Blueprint for Backend Developer

const state = {
  outside_temp: -35.0,
  wind_speed: 42.0,
  fuel_percent: 76.5,
  power_load: 245.0,
  hvac_status: "NOMINAL",
  blizzard_warning: false
};

// Fast-lane simulation tick (Runs every 2 seconds)
function tickFastLane() {
  // 1. Simulate environmental fluctuations
  state.outside_temp += (Math.random() - 0.5) * 0.8;
  state.wind_speed = Math.max(5, state.wind_speed + (Math.random() - 0.5) * 4);
  
  // 2. Simulate fuel consumption
  state.fuel_percent = Math.max(0, state.fuel_percent - 0.002);
  
  // 3. Evaluate Decision Engine Triggers
  if (state.wind_speed > 100) {
    state.blizzard_warning = true;
  } else {
    state.blizzard_warning = false;
  }

  return state;
}

module.exports = { tickFastLane };
