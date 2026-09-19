# Infrastructure & Room Health Data Schema

**Polling Frequency:** Every 5 seconds (critical for heating/structural alerts)
**Endpoint:** `GET /api/station/:stationId/infrastructure`
**Purpose:** Real-time structural and environmental health of all station modules

---

## Complete JSON Payload

```json
{
  "station_id": "Maitri",
  "station_name": "Maitri Antarctic Research Station",
  "timestamp": "2026-08-24T14:00:00Z",
  "polling_interval_seconds": 5,
  
  "modules": {
    "living_quarters": {
      "module_id": "MOD-LQ-001",
      "status": "operational",
      "status_values": ["operational", "fault", "maintenance", "offline"],
      "status_color": "green",
      
      "thermal_management": {
        "indoor_temperature_c": 18.5,
        "temperature_setpoint_c": 20.0,
        "temperature_critical_low_c": 5.0,
        "temperature_warning_low_c": 10.0,
        "temperature_trend": "stable",
        "heating_active": true
      },
      
      "environmental": {
        "humidity_percent": 45,
        "humidity_max_threshold": 60,
        "humidity_warning_threshold": 55,
        "air_circulation_status": "nominal",
        "co2_level_ppm": 420
      },
      
      "safety": {
        "fire_alarm_status": false,
        "smoke_detector_status": "active",
        "sprinkler_system": "active",
        "emergency_exits_clear": true
      },
      
      "occupancy": {
        "current_occupants": 6,
        "max_capacity": 8,
        "occupancy_percent": 75
      }
    },
    
    "main_lab": {
      "module_id": "MOD-LAB-001",
      "status": "operational",
      "status_color": "green",
      
      "thermal_management": {
        "indoor_temperature_c": 19.2,
        "temperature_setpoint_c": 20.0,
        "temperature_critical_low_c": 5.0,
        "temperature_warning_low_c": 10.0,
        "temperature_trend": "stable",
        "heating_active": true
      },
      
      "environmental": {
        "humidity_percent": 42,
        "humidity_max_threshold": 50,
        "air_circulation_status": "nominal"
      },
      
      "equipment": {
        "research_equipment_operational_percent": 100,
        "critical_equipment_status": "all_operational",
        "freezer_units_temp_c": -20.0
      },
      
      "safety": {
        "fire_alarm_status": false,
        "chemical_storage_secure": true
      }
    },
    
    "storage_module": {
      "module_id": "MOD-STORAGE-001",
      "status": "operational",
      "status_color": "green",
      
      "thermal_management": {
        "indoor_temperature_c": -5.0,
        "temperature_setpoint_c": -5.0,
        "temperature_critical_high_c": 0.0,
        "temperature_warning_high_c": -2.0,
        "temperature_trend": "stable",
        "refrigeration_active": true
      },
      
      "inventory_storage": {
        "total_capacity_percent": 85,
        "food_storage_status": "adequate",
        "medical_storage_status": "adequate"
      }
    }
  },
  
  "systems": {
    "hvac_main": {
      "system_id": "HVAC-001",
      "status": "nominal",
      "status_values": ["nominal", "fault", "degraded", "maintenance"],
      "status_color": "green",
      "description": "Primary heating, ventilation, and air conditioning system",
      
      "operation": {
        "heating_active": true,
        "ventilation_active": true,
        "backup_available": true,
        "efficiency_percent": 94
      },
      
      "performance": {
        "air_circulation_cfm": 5420,
        "target_circulation_cfm": 5500,
        "heat_exchanger_efficiency_percent": 94
      },
      
      "thresholds": {
        "maintenance_due_hours": 250,
        "last_maintenance_date": "2026-08-20",
        "next_maintenance_due": "2026-10-15"
      }
    },
    
    "hvac_backup": {
      "system_id": "HVAC-BACKUP-001",
      "status": "standby",
      "backup_heating_available": true
    }
  },
  
  "structural_health": {
    "snow_load_on_roof_kg": 15000,
    "snow_load_threshold_kg": 20000,
    "snow_load_critical_threshold_kg": 25000,
    "structural_integrity_percent": 98,
    "roof_strain_sensors": "nominal",
    "foundation_status": "stable"
  },
  
  "alerts_local": [
    // Generated alerts specific to infrastructure
    // Example: { "severity": "warning", "message": "Humidity approaching max", "module": "living_quarters" }
  ],
  
  "system_health_score": 96,
  "system_health_trend": "stable"
}
```

---

## Integration Notes for Developers

### **Backend Developer:**
- Temperature fluctuations: ±0.3°C per polling interval
- If HVAC status becomes "fault", temperature should DROP 2°C every 10 seconds
- Humidity increases if ventilation is off
- Snow load increases during blizzard conditions (every 5 seconds + 50kg if blizzard_warning = true)

### **Frontend Developer:**
- Use SVG blueprint to show module states (color-coded by status)
- Temperature gauge: Green (>10°C), Yellow (5-10°C), Red (<5°C)
- Humidity bar: Green (<50%), Yellow (50-60%), Red (>60%)
- Show alert modal if any module drops below critical_low_c

### **Critical Thresholds:**
| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Temperature | <10°C | <5°C | Activate backup heaters |
| Humidity | >55% | >60% | Increase ventilation |
| Snow Load | >20,000kg | >25,000kg | Emergency roof clearance |

---
