# Environmental & Weather Data Schema

**Polling Frequency:** Every 1-2 seconds (DISASTER MANAGEMENT CRITICAL)
**Endpoint:** `GET /api/station/:stationId/environment`
**Purpose:** Extreme polar weather monitoring. Used for emergency protocols and operational safety.

---

## Complete JSON Payload

```json
{
  "station_id": "Maitri",
  "timestamp": "2026-08-24T14:00:00Z",
  "polling_interval_seconds": 2,
  
  "exterior_conditions": {
    "temperature": {
      "outside_temperature_c": -35.2,
      "temperature_trend": "stable",
      "temperature_rate_of_change_c_per_hour": -0.5,
      
      "thresholds": {
        "extreme_cold_c": -50,
        "severe_cold_c": -40,
        "warning_cold_c": -35
      },
      
      "alerts": {
        "is_extreme_cold": false,
        "is_severe_cold": false,
        "is_warning_cold": true
      }
    },
    
    "wind": {
      "wind_speed_kmh": 42.5,
      "wind_gust_kmh": 68.3,
      "wind_direction": "SSE",
      "wind_direction_degrees": 157,
      "wind_trend": "increasing",
      
      "thresholds": {
        "blizzard_threshold_kmh": 100,
        "severe_wind_threshold_kmh": 75,
        "warning_wind_threshold_kmh": 60
      },
      
      "alerts": {
        "is_blizzard_condition": false,
        "is_severe_wind": false,
        "is_warning_wind": false
      }
    },
    
    "visibility": {
      "visibility_meters": 3200,
      "visibility_trend": "improving",
      
      "thresholds": {
        "whiteout_meters": 100,
        "severe_visibility_meters": 500,
        "poor_visibility_meters": 1000
      },
      
      "alerts": {
        "is_whiteout": false,
        "is_severe_visibility_low": false
      }
    }
  },
  
  "weather_phenomena": {
    "blizzard": {
      "blizzard_warning": false,
      "blizzard_active": false,
      "blizzard_trigger_conditions": {
        "wind_speed_kmh": 42.5,
        "wind_threshold": 100,
        "visibility_meters": 3200,
        "visibility_threshold": 500,
        "both_conditions_met": false
      },
      "estimated_blizzard_duration_hours": 0,
      "field_teams_affected_count": 0
    },
    
    "precipitation": {
      "precipitation_type": "none",
      "precipitation_type_values": ["none", "light_snow", "moderate_snow", "heavy_snow", "ice"],
      "precipitation_rate_mm_per_hour": 0.0,
      "snow_accumulation_today_mm": 0.0,
      "total_snow_depth_on_ground_cm": 185
    },
    
    "atmospheric": {
      "atmospheric_pressure_mb": 1013.2,
      "pressure_trend": "stable",
      "humidity_percent": 68,
      "uv_index": 4,
      "ozone_level_dobson_units": 280
    }
  },
  
  "solar_conditions": {
    "solar_radiation_w_m2": 450.0,
    "solar_radiation_trend": "stable",
    "seasonal_phase": "austral_summer",
    "daylight_hours": 18,
    "solar_panel_efficiency_percent": 78
  },
  
  "interconnections_with_other_systems": {
    "impact_on_energy": {
      "wind_supporting_generation": false,
      "solar_supporting_generation": true,
      "solar_output_contribution_kw": 60
    },
    
    "impact_on_operations": {
      "outdoor_operations_possible": true,
      "field_team_safety_status": "safe",
      "recommendations": "Monitor wind speeds. If approaching 75 kmh, recall field teams."
    },
    
    "impact_on_infrastructure": {
      "snow_loading_on_roof": "moderate",
      "structural_risk": "low",
      "heating_demand": "moderate"
    }
  },
  
  "emergency_scenarios": {
    "scenario_blizzard_lockdown": {
      "likelihood": "low",
      "trigger_threshold_wind": 100,
      "trigger_threshold_visibility": 500,
      "current_status": "not_triggered",
      "estimated_effect": "Complete operational lockdown, field teams recalled"
    },
    
    "scenario_extreme_cold": {
      "likelihood": "medium",
      "trigger_threshold_temp": -50,
      "current_status": "not_triggered",
      "estimated_effect": "Increased heating demand, equipment stress"
    }
  },
  
  "alerts_local": [
    // Example: { "severity": "warning", "message": "Wind speed increasing, approaching 60 kmh threshold" }
  ],
  
  "system_health_score": 95,
  "overall_weather_risk": "low"
}
```

---

## Integration Notes for Developers

### **Backend Developer:**
- Wind fluctuates randomly: `±2-5 kmh per polling interval`
- Temperature fluctuates: `±0.2°C per polling interval`
- If wind > 100 AND visibility < 500: `blizzard_warning = true` (automatic)
- Snow depth increases by 5mm every 12 simulated hours
- Solar radiation follows time-of-day pattern (peaks at noon)

### **Frontend Developer:**
- **CRITICAL:** If `blizzard_warning = true`, show full-screen emergency modal with RED background
- Wind gauge: Green (<60 kmh), Yellow (60-100 kmh), Red (>100 kmh)
- Temperature gauge: Color-coded (-35 to -50°C = increasing warning)
- Show wind direction arrow (compass rose)
- **Emergency Alert:** If both wind > 100 AND visibility < 500, trigger emergency protocols

### **Critical Thresholds:**
| Condition | Warning | Emergency | Action |
|-----------|---------|-----------|--------|
| Wind Speed | 60 kmh | 100 kmh | Recall field teams at 75 kmh |
| Visibility | 1000 m | 500 m | Lockdown operations |
| Temperature | -40°C | -50°C | Activate max heating |
| Blizzard Combo | Approaching | Active | FULL EMERGENCY MODE |

---
