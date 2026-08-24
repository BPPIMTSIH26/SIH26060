# SIH26060: Antarctic Digital Twin Framework

## Problem Statement Details

| Attribute | Details |
| :--- | :--- |
| **Problem Statement ID** | 26060 |
| **Problem Statement Title** | Digital Platform for efficient remote management of Indian Antarctic Research Stations |
| **Project Title** | Antarctic Digital Twin Framework |
| **Organization** | Ministry of Earth Sciences (MoES) |
| **Department** | National Centre for Polar and Ocean Research (NCPOR) |
| **Category** | Software |
| **Theme** | Disaster Management |
| **Project Overview** | A Real-Time Remote Management and Disaster Response platform for Maitri and Bharati research stations. Uses a "Thin Client, Heavy Backend" architecture to visualize live telemetry and trigger emergency protocols. |

---

## Tech Stack & Dependencies

| Layer | Technology / Tool | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React | Core UI Framework |
| **Styling** | Tailwind CSS | Responsive & Custom UI Styling |
| **Data Visualization** | Recharts | Live & Historical Trendline Charts |
| **Routing** | React Router | Single Page Application (SPA) Navigation |
| **Backend** | Node.js / Express.js | REST APIs & Data Simulation Engine |
| **Database** | SQLite / Local JSON | Logging Historical Telemetry Data |
| **Data Integration** | Axios / Fetch API | Polling Fast-Lane & Fetching Slow-Lane Data |

---

## System Architecture: Two-Lane Data Flow

| Component | Architecture Role | Description |
| :--- | :--- | :--- |
| **Fast Lane** | Simulation Engine | Continuous backend script generating environmental (weather) and energy (fuel/power) metrics every few seconds. |
| **Slow Lane** | Static Database | Local storage layer managing logistics (food, medical, personnel) and infrastructure states that update infrequently. |
| **Decision Engine** | Threshold Logic | Evaluates cross-variable parameters (e.g., `fuel < 30% AND load > 200kW`) to automatically broadcast critical emergency alerts. |

---

## Data Mapping & Core Pillars

| Pillar | Focus Area | Monitored Metrics & Parameters |
| :--- | :--- | :--- |
| **Infrastructure** | Station Health | Module operational states, indoor temperatures, HVAC health, and fire alarm triggers. |
| **Energy** | Power Grid | Generator active/standby status, fuel consumption rates, battery backup durations, and total power load. |
| **Environment** | Exterior Conditions | Outside temperature, wind speed, visibility drops, and automated blizzard warnings. |
| **Logistics** | Supply & Roster | Days of food remaining, medical supply thresholds, active personnel rosters, and shipment ETAs. |
