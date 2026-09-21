<h1 align="center">🧊 NCPOR Polar Twin: Antarctic Operations Command</h1>

<h3 align="center">Comprehensive Digital Twin Simulation & Logistics Intelligence</h3>
<br>
<div align="center">

  <!-- Hackathon Meta Badges -->
  <a href="https://sih.gov.in"><img src="https://img.shields.io/badge/Smart_India_Hackathon-2026-0284c7?style=flat-square" alt="SIH 2026" /></a>
  <a href="https://github.com/BPPIMTSIH26"><img src="https://img.shields.io/badge/Organization-BPPIMTSIH26-4f46e5?style=flat-square" alt="Organization" /></a>
  <a href="https://github.com/BPPIMTSIH26"><img src="https://img.shields.io/badge/Team-ORION-F4C430?style=flat-square" alt="Organization" /></a>
  <a href="https://github.com/BPPIMTSIH26/SIH26060"><img src="https://img.shields.io/badge/Problem_Statement_ID-SIH26060-059669?style=flat-square" alt="Problem Statement" /></a>

  <!-- Technology Stack Badges -->
  <a href="#"><img src="https://img.shields.io/badge/React-Frontend-blue?logo=react&logoColor=white" alt="React" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Vite-Build_Tool-646CFF?logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white" alt="Node.js" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Express.js-Server-000000?logo=express&logoColor=white" alt="Express" /></a>
  <a href="#"><img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white" alt="MongoDB" /></a>

</div>

**Polar Twin** is a comprehensive full-stack digital twin simulation engine featuring **interactive 3D WebGL environments**, designed to model interdependent telemetry and supply chain workflows for India's extreme-environment research stations in Antarctica: **Maitri** and **Bharati**.

This system provides real-time monitoring, a Rule-Based Risk & Alert System, and role-based logistics management to ensure low-latency operational oversight for the **National Centre for Polar and Ocean Research (NCPOR)**.

<div align="center">
<!-- Quick Action Links -->
  <a href="https://ncporpolartwin.vercel.app"><img src="https://img.shields.io/badge/Live_Preview-View_Application-10b981?style=flat-square&logo=vercel&logoColor=white" alt="Live Preview" /></a>
  <a href="https://ncporpolartwin.vercel.app"><img src="https://img.shields.io/badge/Video_Demo-Watch_Now-FF0000?style=flat-square&logo=youtube&logoColor=white" alt="Video Demo" /></a>
</div>
<br>

<div align="center">

> **Smart India Hackathon (SIH 2026) | Problem Statement ID: SIH26060**  
> **Team: ORION | Team ID: ------**  
> **Institution:** B.P. Poddar Institute of Management & Technology (**BPPIMT**)  
> **Lead Architect & Full-Stack Engineer:** **[Sayantan Pachal](https://github.com/sayantan-pachal)**
</div>

---

## 📌 Problem Statement Overview (SIH 26060)

| Attribute | Specification Details |
| :--- | :--- |
| **Problem Statement ID** | **26060** |
| **Problem Statement Title** | **Digital Platform for efficient remote management of Indian Antarctic Research Stations** |
| **Description** | Develop a **Digital Twin framework for Maitri and Bharati stations** integrating **infrastructure, energy, logistics, and environmental monitoring** for efficient remote management. |
| **Organization** | **Ministry of Earth Sciences (MoES)** |
| **Department** | **National Centre for Polar and Ocean Research (NCPOR)** |
| **Category** | **Software** |
| **Theme** | **Smart Automation** |

### The Real-World Challenge

Managing India's extreme-environment research stations (Maitri and Bharati) in Antarctica presents unprecedented logistical and operational bottlenecks:

1. **Constrained Satellite Bandwidth:** Transmitting high-frequency operational data from the South Pole risks severe latency, packet loss, and network saturation over limited satellite uplinks.
2. **Severe Environmental Hazards:** Lethal temperature drops and blinding blizzards require instantaneous detection to initiate automated lockdown protocols and protect both personnel and infrastructure.
3. **Cascading Subsystem Failures:** A localized power deficit directly impacts life-support thermal management, while incoming weather delays critical logistics. Traditional, isolated dashboards fail to map these cause-and-effect relationships.
4. **High-Stakes Supply Chain Fragmentation:** Managing life-critical supplies (fuel, medical, rations) across continents demands a fault-tolerant, multi-stage authorization workflow from initial requisition to on-station delivery.
5. **Hardware Isolation & Testing Latency:** Developers and planners lack physical access to classified remote sensor arrays, necessitating a high-fidelity software simulation environment to safely test disaster response protocols.
6. **Reporting & Oversight Delays:** Higher authorities at NCPOR command require immediate, structured situational awareness, but compiling data across fragmented systems leads to dangerous intelligence delays.

--- 
## 💡 The POLAR TWIN Solution

**Polar Twin** is an end-to-end full-stack digital twin simulation engine designed to model, monitor, and autonomously triage interdependent telemetry and supply chain workflows, ensuring low-latency oversight for the **National Centre for Polar and Ocean Research (NCPOR)**.

```mermaid
flowchart TD
    subgraph Simulation [Autonomous Telemetry Engine]
        A["⚙️ Node.js Backend Simulation"] --> B["⚡ Fast-Lane API / ~4KB Payload"]
        B --> C["🌡️ Environment: Blizzard & Temp"]
        B --> D["🔋 Energy: Grid Load & Battery"]
        B --> E["🏗️ Infrastructure: HVAC & Structural"]
    end
    
    subgraph Triage [3-Tier Rule-Based Triage]
        C -->|Trigger| F["🔒 Automated Station Lockdown"]
        D -->|Deficit| G["📉 Automated Load Shedding"]
        E -->|Failure| H["🔥 Critical Fire/Thermal Alert"]
        
        F --> I["🚨 Alert Propagation Engine"]
        G --> I
        H --> I
    end

    subgraph Workflow [RBAC Supply Chain]
        K["📝 Station Master Requisition"] --> S["📦 Slow-Lane API / Transactional Ledger"]
        S --> L["✅ Authority Approval"]
        L --> M["🚚 Logistics Processing & Transit"]
        M --> N["🔄 Station Delivery & Inventory Sync"]
    end

    subgraph Command [Tactical Interface]
        I --> J["💻 React UI Comprehensive Dashboard"]
        N --> J
        J --> O["📊 Dynamic A4 PDF/CSV Reports"]
    end

    %% Class Definitions for Colors
    classDef sim fill:#0f766e,stroke:#5eead4,color:#fff,stroke-width:2px
    classDef triage fill:#9f1239,stroke:#fda4af,color:#fff,stroke-width:2px
    classDef work fill:#5b21b6,stroke:#d8b4fe,color:#fff,stroke-width:2px
    classDef cmd fill:#1d4ed8,stroke:#93c5fd,color:#fff,stroke-width:2px

    %% Assigning Classes to Nodes
    class A,B,C,D,E sim
    class F,G,H,I triage
    class K,S,L,M,N work
    class J,O cmd
```

> **Target End-Users**: NCPOR Command, Station Masters, Logistics Planners, Higher Authority  
> **Core Innovation**: Ultra-Low Bandwidth Telemetry (~4KB JSON) + 3-Tier Rule-Based Operational Alerts + Multi-Stage RBAC Logistics + Dynamic Report Generation 

## 🧠 Why Polar Twin Is a Digital Twin

Polar Twin combines three interconnected layers:

1. **Physical Representation**
   - Interactive 3D models of Maitri and Bharati.
   - Procedurally generated station environments and terrain.

2. **Operational State**
   - Simulated telemetry for energy, environment, infrastructure, inventory, and station modules.
   - Historical snapshots and current operational state.

3. **Decision & Response Layer**
   - Rule-based anomaly detection.
   - Automated lockdown and load-shedding responses.
   - RBAC logistics workflows.
   - Reporting and operational oversight.

This creates a closed software representation of the station where the visual twin, simulated operational state, and response workflows operate as interconnected components rather than independent dashboard features.

## 🖥️ Visual Preview

### Interactive 3D Station Twin

The command dashboard provides an interactive WebGL digital twin of the Maitri and Bharati research stations.

<p align="center">
  <img src="./archive/Maitri 3D Digital Twin.png" alt="Maitri 3D Digital Twin" width="48%">
  <img src="./archive/Bharati 3D Digital Twin.png" alt="Bharati 3D Digital Twin" width="48%">
</p>

### Operational Command Dashboard

<p align="center">
  <img src="./archive/Polar Twin Command Dashboard.png" alt="Polar Twin Command Dashboard" width="90%">
</p>

## ⚙️ Core System Capabilities

### 1. 📡 Ultra-Low Bandwidth Telemetry Engine

- Operates independently via a custom Node.js backend generation engine, realistically simulating ambient temperature fluctuations, generator loads, and fuel burn rates.
- **Extreme Data Optimization:** Compresses the entire interdependent state of the station (Energy, Environment, Infrastructure) into a microscopic **~4KB JSON payload**, ensuring low-latency updates over severely constrained Antarctic networks.

### 2. 🚨 3-Tier Rule-Based Risk & Alert System

- **Automated Triage:** Continuously parses telemetry streams to classify anomalies into a strict, globally visible 3-stage matrix (Nominal, Warning, Critical).
- **Event-Driven Mitigation:** Detects rapid temperature drops and high winds to immediately trigger cross-system blizzard lockdowns and automatic load shedding before catastrophic failure occurs.

### 3. ⚡ Interdependent Grid & Infrastructure Health

- **Live Net Power Mapping:** Continuously calculates total generation against station load, deploying automated battery depletion logic and estimated time-to-empty calculations.
- **Structural Diagnostics:** Tracks HVAC efficiency, fire suppression readiness, and module-specific internal climates (e.g., Main Lab vs. Living Quarters).

### 4. 📦 State-Machine Logistics & Supply Workflow

- **End-to-End Tracking:** Enforces a rigid lifecycle for all critical resources: *Requested → Authority Approved → Processing → In Transit → Delivered.*
- **Telemetry Syncing:** Prevents resource depletion by automatically syncing projected delivery ETAs with the live inventory burn-rate engine.

### 5. 🛡️ Access Control (RBAC)

- **Role-Based Geofencing:** Strictly segregated privileges restrict Station Masters to their assigned base, while granting Logistics and Authority roles cross-station oversight.
- **Zero-Trust Security:** Secured via HTTP-only JWTs, robust session management, and SMTP-based OTP verification for high-clearance account creation and recovery.

### 6. 📊 Dynamic Executive Reporting Engine

- **On-Demand Intelligence:** Compiles targeted historical data (Energy, Environment, Logistics, or Overall) on the fly based on the user's domain scope and time window.
- **Client-Side Export Processing:** Features an advanced `@react-pdf/renderer` engine to dynamically generate structured A4 PDFs and CSV tables for immediate off-station executive briefings without overloading the server.

### 7. 🧊 Interactive 3D Antarctic Digital Twin

- **Photorealistic Station Representation:** Renders dedicated 3D digital-twin models of the Maitri and Bharati research stations using GLB assets.
- **Interactive WebGL Visualization:** Built with React Three Fiber, Three.js, and Drei, allowing operators to orbit, inspect, and navigate the station environment directly inside the command dashboard.
- **Station-Specific Twin Environments:** Maitri and Bharati use dedicated procedural environments representing their surrounding terrain, infrastructure context, and operational surroundings.
- **Telemetry-Aware Visualization:** Live station telemetry is surfaced alongside the 3D twin, connecting physical station modules with their corresponding operational status.
- **Fullscreen Twin Mode:** Operators can expand the 3D station view into a dedicated fullscreen topology/inspection interface.
- **Dynamic Day/Night Environment:** The visualization automatically adapts the Antarctic scene according to the calculated station day/night cycle.

### 8. 🏔️ Procedural Antarctic Environment Engine

- **Procedural Terrain:** Generates station surroundings algorithmically using layered mathematical terrain functions rather than relying solely on static background imagery.
- **Station-Specific Landscapes:** Maitri and Bharati use separate environment-generation pipelines reflecting their different terrain characteristics.
- **Environmental Assets:** Procedurally distributes rocks, storage containers, terrain features, and other contextual objects around the station.
- **Terrain Shading:** Uses vertex-level terrain coloring to differentiate snow, rock, ice, and exposed terrain.
- **Dynamic Lighting:** Integrates day/night environment lighting and star fields for immersive polar visualization.
- **GPU-Aware Rendering:** Reuses geometries and materials where possible and explicitly disposes WebGL resources during component unmounts to reduce GPU memory leakage.

### 9. 🔗 Telemetry-Linked Digital Twin

The 3D visualization is not a standalone animation layer. It is connected to the same operational telemetry and station-state pipeline used by the command dashboard.

- Live environment telemetry drives contextual indicators such as temperature and wind conditions.
- Station modules expose operational states such as Online, Warning, Critical, Maintenance, and Offline.
- Station-specific telemetry is presented alongside the corresponding 3D twin.
- Maitri and Bharati can be switched without changing the underlying monitoring architecture.
- The visualization therefore acts as a spatial operational interface over the simulated station state rather than a purely decorative 3D scene.

## 🖥️ System Architecture & UI Tour

```mermaid
flowchart TD

subgraph group_frontend["Command Interface"]
  node_auth_ui["Authentication UI<br/>[Auth.jsx]"]
  node_command_ui["Command Dashboard<br/>[Dashboard.jsx]"]
  node_domain_views["Domain Views<br/>[EnergyPower.jsx]"]
  node_logistics_ui["Logistics Workspace<br/>[Logistics.jsx]"]
  node_reports_ui["Reports Workspace<br/>[Reports.jsx]"]
end

subgraph group_access["Access Services"]
  node_server["API Server<br/>[server.js]"]
  node_auth_routes["Auth Routes<br/>[authRoutes.js]"]
  node_auth_controller["Auth Controller<br/>[authController.js]"]
  node_auth_middleware["Auth Middleware<br/>[authMiddleware.js]"]
end

subgraph group_simulation["Twin Simulation"]
  node_sim_engine["Simulation Engine<br/>[engine.js]"]
  node_environment_engine["Environment Engine"]
  node_energy_engine["Energy Engine<br/>[energyEngine.js]"]
  node_infra_engine["Infrastructure Engine<br/>[infraEngine.js]"]
  node_alert_engine["Alert Engine<br/>[alertEngine.js]"]
end

subgraph group_api["Operational APIs"]
  node_telemetry_api["Telemetry API<br/>[fastLane.js]"]
  node_logistics_api["Logistics API<br/>[slowLane.js]"]
  node_order_controller["Order Controller<br/>[orderController.js]"]
  node_logistics_controller["Logistics Controller"]
  node_report_controller["Report Controller"]
end

subgraph group_data["Operational Data"]
  node_user_model[("User Accounts<br/>[User.js]")]
  node_otp_model[("OTP Records<br/>[Otp.js]")]
  node_order_model[("Order Ledger<br/>[Order.js]")]
  node_inventory_model[("Inventory State<br/>[Inventory.js]")]
  node_snapshot_model[("Historical Snapshots")]
end

node_operator(("NCPOR Operator"))
node_smtp["SMTP Email"]
node_mongo[("MongoDB")]

node_operator -->|"signs in"| node_auth_ui
node_operator -->|"monitors stations"| node_command_ui
node_auth_ui -->|"submits credentials"| node_auth_routes
node_command_ui -->|"fetches telemetry"| node_telemetry_api
node_domain_views -->|"reads domains"| node_telemetry_api
node_logistics_ui -->|"manages supplies"| node_logistics_api
node_logistics_ui -->|"submits requisitions"| node_order_controller
node_reports_ui -->|"requests reports"| node_report_controller
node_server -->|"mounts routes"| node_auth_routes
node_server -->|"mounts routes"| node_telemetry_api
node_server -->|"mounts routes"| node_logistics_api
node_server -->|"mounts reports"| node_report_controller
node_auth_routes -->|"dispatches auth"| node_auth_controller
node_auth_routes -->|"protects updates"| node_auth_middleware
node_auth_controller -->|"reads users"| node_user_model
node_auth_controller -->|"verifies OTPs"| node_otp_model
node_auth_controller -.->|"sends OTPs"| node_smtp
node_user_model -->|"persists accounts"| node_mongo
node_otp_model -->|"persists codes"| node_mongo
node_telemetry_api -->|"serves state"| node_sim_engine
node_sim_engine -->|"ticks weather"| node_environment_engine
node_sim_engine -->|"ticks energy"| node_energy_engine
node_sim_engine -->|"ticks infrastructure"| node_infra_engine
node_sim_engine -->|"evaluates alerts"| node_alert_engine
node_sim_engine -->|"syncs inventory"| node_inventory_model
node_order_controller -->|"stores orders"| node_order_model
node_order_controller -->|"injects deliveries"| node_sim_engine
node_order_model -->|"persists ledger"| node_mongo
node_inventory_model -->|"persists stock"| node_mongo
node_report_controller -->|"reads live state"| node_sim_engine
node_report_controller -->|"reads history"| node_snapshot_model
node_snapshot_model -->|"reads snapshots"| node_mongo

click node_auth_ui "https://github.com/bppimtsih26/sih26060/blob/main/frontend/src/components/Auth/Auth.jsx"
click node_command_ui "https://github.com/bppimtsih26/sih26060/blob/main/frontend/src/pages/Dashboard/Dashboard.jsx"
click node_domain_views "https://github.com/bppimtsih26/sih26060/blob/main/frontend/src/pages/EnergyPower/EnergyPower.jsx"
click node_logistics_ui "https://github.com/bppimtsih26/sih26060/blob/main/frontend/src/pages/Logistics/Logistics.jsx"
click node_reports_ui "https://github.com/bppimtsih26/sih26060/blob/main/frontend/src/pages/Reports/Reports.jsx"
click node_server "https://github.com/bppimtsih26/sih26060/blob/main/Backend/server.js"
click node_auth_routes "https://github.com/bppimtsih26/sih26060/blob/main/Backend/routes/authRoutes.js"
click node_auth_controller "https://github.com/bppimtsih26/sih26060/blob/main/Backend/controllers/authController.js"
click node_auth_middleware "https://github.com/bppimtsih26/sih26060/blob/main/Backend/middleware/authMiddleware.js"
click node_sim_engine "https://github.com/bppimtsih26/sih26060/blob/main/Backend/simulation/engine.js"
click node_environment_engine "https://github.com/bppimtsih26/sih26060/blob/main/Backend/simulation/engines/environmentEngine.js"
click node_energy_engine "https://github.com/bppimtsih26/sih26060/blob/main/Backend/simulation/engines/energyEngine.js"
click node_infra_engine "https://github.com/bppimtsih26/sih26060/blob/main/Backend/simulation/engines/infraEngine.js"
click node_alert_engine "https://github.com/bppimtsih26/sih26060/blob/main/Backend/simulation/engines/alertEngine.js"
click node_telemetry_api "https://github.com/bppimtsih26/sih26060/blob/main/Backend/routes/fastLane.js"
click node_logistics_api "https://github.com/bppimtsih26/sih26060/blob/main/Backend/routes/slowLane.js"
click node_order_controller "https://github.com/bppimtsih26/sih26060/blob/main/Backend/controllers/orderController.js"
click node_logistics_controller "https://github.com/bppimtsih26/sih26060/blob/main/Backend/controllers/logisticsController.js"
click node_report_controller "https://github.com/bppimtsih26/sih26060/blob/main/Backend/controllers/reportController.js"
click node_user_model "https://github.com/bppimtsih26/sih26060/blob/main/Backend/models/User.js"
click node_otp_model "https://github.com/bppimtsih26/sih26060/blob/main/Backend/models/Otp.js"
click node_order_model "https://github.com/bppimtsih26/sih26060/blob/main/Backend/models/Order.js"
click node_inventory_model "https://github.com/bppimtsih26/sih26060/blob/main/Backend/models/Inventory.js"
click node_snapshot_model "https://github.com/bppimtsih26/sih26060/blob/main/Backend/models/HistoricalSnapshot.js"

classDef frontend fill:#1e3a8a,stroke:#60a5fa,color:#fff,stroke-width:2px
classDef access fill:#78350f,stroke:#fbbf24,color:#fff,stroke-width:2px
classDef sim fill:#14532d,stroke:#4ade80,color:#fff,stroke-width:2px
classDef api fill:#4c1d95,stroke:#c084fc,color:#fff,stroke-width:2px
classDef data fill:#0f172a,stroke:#38bdf8,color:#fff,stroke-width:2px
classDef external fill:#881337,stroke:#f43f5e,color:#fff,stroke-width:2px

class node_auth_ui,node_command_ui,node_domain_views,node_logistics_ui,node_reports_ui frontend
class node_server,node_auth_routes,node_auth_controller,node_auth_middleware access
class node_sim_engine,node_environment_engine,node_energy_engine,node_infra_engine,node_alert_engine sim
class node_telemetry_api,node_logistics_api,node_order_controller,node_logistics_controller,node_report_controller api
class node_user_model,node_otp_model,node_order_model,node_inventory_model,node_snapshot_model data
class node_operator,node_smtp,node_mongo external
```

<div align="center">

| Module | Route / Component | Description |
| :--- | :--- | :--- |
| **Tactical Dashboard** | `/dashboard` (`Dashboard.jsx`) | Real-time health scores, active blizzards, grid deficits, and priority alerts. |
| **3D Station Twin** | `/dashboard` (`StationMap.jsx`) | Interactive WebGL digital twin of Maitri and Bharati with GLB station models, procedural terrain, telemetry overlays, day/night visualization, and fullscreen inspection. |
| **Requisitions Command** | `/requisitions` (`Requisitions.jsx`) | RBAC supply chain queues, multi-stage approval pipelines, and direct inventory tracking. |
| **Data Export Engine** | `/reports` (`Reports.jsx`) | Configurable reporting matrix generating `@react-pdf/renderer` A4 dossiers and CSV tables. |
| **Energy Matrix** | `/energy` (`Energy.jsx`) | Deep-dive telemetry for diesel generators, active loads, and battery arrays. |
| **Environment Grid** | `/environment` (`Environment.jsx`) | Meteorological monitoring, thermal mapping, and atmospheric blizzard diagnostics. |
| **Infrastructure Health** | `/infrastructure` (`Infrastructure.jsx`) | Structural diagnostics, module-specific climates, and HVAC ventilation status. |
| **System Auth** | `/auth` (`Auth.jsx`) | Secured gateway featuring SMTP OTP dispatch and strict JWT session validation. |

</div>

```mermaid
flowchart TD
    A["🧊 3D Digital Twin Architecture"]

    A --> B["Station Selection"]
    B --> C["Maitri Twin"]
    B --> D["Bharati Twin"]

    C --> E["Station GLB Model"]
    D --> F["Station GLB Model"]

    E --> G["React Three Fiber"]
    F --> G

    G --> H["Three.js + Drei"]

    H --> I["Station-Specific Environment"]

    I --> J["🏔️ Procedural Terrain"]
    I --> K["🪨 Environmental Assets"]
    I --> L["❄️ Snow / Ice / Rock Shading"]
    I --> M["🌌 Dynamic Lighting & Star Field"]

    H --> N["🎥 Interactive Camera"]
    N --> O["Orbit / Inspection"]
    N --> P["Fullscreen Twin Mode"]

    Q["📡 Live Telemetry"] --> R["Station State"]
    R --> S["Environment Status"]
    R --> T["Module Status"]
    R --> U["Operational Indicators"]

    S --> I
    T --> H
    U --> H

    V["☀️ Day / Night Cycle"] --> M

    W["⚡ WebGL Performance Layer"] --> X["Shared Geometries & Materials"]
    W --> Y["Memoized Terrain"]
    W --> Z["Resource Disposal"]

    G --> W

    classDef root fill:#0f172a,stroke:#38bdf8,color:#fff,stroke-width:2px
    classDef station fill:#1e3a8a,stroke:#60a5fa,color:#fff
    classDef render fill:#312e81,stroke:#818cf8,color:#fff
    classDef environment fill:#14532d,stroke:#4ade80,color:#fff
    classDef telemetry fill:#78350f,stroke:#fbbf24,color:#fff
    classDef performance fill:#4c1d95,stroke:#c084fc,color:#fff

    class A root
    class B,C,D station
    class E,F,G,H,N,O,P render
    class I,J,K,L,M,V environment
    class Q,R,S,T,U telemetry
    class W,X,Y,Z performance
```

### ⚡ 3D Rendering & Performance

The 3D layer is designed with browser/WebGL performance in mind:

- GLB assets are preloaded using `useGLTF.preload()`.
- Procedural terrain uses typed vertex-color buffers.
- Shared geometries and materials reduce unnecessary GPU allocations.
- Expensive terrain calculations are memoized.
- WebGL geometries and materials are explicitly disposed when components unmount.
- Camera distance and polar-angle limits prevent uncontrolled scene navigation.

## 🛠️ Technology Stack

```text
SIH26060/
├── backend/                 # Node.js + Express Simulation & API Server
│   ├── config/              # Environment and database configurations
│   ├── controllers/         # Telemetry generation, Auth logic, Report formatting
│   ├── middleware/          # JWT authentication and request validation
│   ├── models/              # Mongoose schemas (User, History, Logs)
│   ├── routes/              # Secured REST API endpoints
│   ├── simulation/          # The core algorithmic event-bus engine
│   ├── uploads/             # Static file storage for generated assets
│   ├── utils/               # Helper functions and formatters
│   ├── package.json         # Root unified dependencies
│   └── server.js            # Main application entry point
├── frontend/                # React + Vite + Tailwind CSS v3
│   ├── public/              # Static public assets
│   │   ├── models/
│   │   │   ├── maitri.glb   # Maitri station 3D digital-twin model
│   │   │   └── bharati.glb  # Bharati station 3D digital-twin model
│   ├── src/                 # React source code
│   │   ├── assets/          # Images, SVGs, and global styles
│   │   ├── components/      # Frost-glass UI cards, Custom Dropdowns, Navbars
│   │   ├── pages/           # Departmental dashboard views
│   │   ├── services/        # Unified API service adapters (Axios)
│   │   ├── Layout.jsx       # Global application layout wrapper
│   │   ├── main.jsx         # React DOM entry point
│   │   └── scrollAnimation.js # Global intersection observer logic
│   ├── index.html           # Main HTML template
│   ├── vercel.json          # Vercel deployment routing configuration
│   ├── package.json         # Root unified dependencies
│   └── vite.config.js       # Vite bundler configuration
└── README.md                # System documentation & technical specification

```

### 💻 Core Technologies

- **Frontend:** React.js, Vite, Tailwind CSS, React Router, Lucide Icons, Recharts, `@react-pdf/renderer`(for on-the-fly programmatic document generation).
- **3D Digital Twin:** Three.js, React Three Fiber, React Three Drei, GLB/GLTF assets, WebGL.
- **Backend & Security**: Node.js, Express.js, JWT (HTTP-Only session management), bcrypt (cryptographic password hashing), Google Apps Script (SMTP OTP dispatch).
- **Database & State**: MongoDB Atlas, Mongoose ODM, React Context API.
- **Architecture**: Event-Driven Simulation Engine, strict REST API segregation (Fast-Lane vs. Slow-Lane).
- **DevOps & Tools**: Vercel (Frontend Edge Deployment), Render (Backend Deployment), Postman (API Documentation & Testing), npm.

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** (v18.0 or higher)
- **MongoDB Atlas** Cluster (or local instance)
- **Git**

### Step-by-Step Manual Setup

**1. Backend Service (Node + Express)**

```
cd backend

# Install dependencies
npm install

# Configure environment variables
# Create a .env file based on .env.example (MONGO_URI, JWT_SECRET, SMTP_PASS, etc.)
cp .env.example .env

# Launch the Simulation API Server
npm run dev

```

- **Backend API**: <http://localhost:5000/api>

**2. Frontend Application (React + Vite)**

```
cd frontend

# Install packages
npm install

# Configure environment variables
# Set VITE_API_BASE_URL to http://localhost:5000/api
cp .env.example .env

# Launch Vite development server
npm run dev
```

- **Frontend Application**: <http://localhost:5173>

## 🛡️ Personnel Access Governance & Clearance Tiers

| Role | Operational Capabilities & Clearance Limitations |
| :--- | :--- |
| **Authority** | Ultimate oversight. Can approve high-priority logistics requisitions and view telemetry for both Maitri and Bharati. |
| **Logistics** | Fleet and supply chain management. Can process approved orders and update transit statuses across both stations. |
| **Station Master** | Locked to assigned station. Can submit requisitions, view local telemetry, and execute local reporting. Cannot view cross-station data. |

> **Security & Authentication Protocol**: Direct plaintext passwords are strictly prohibited. Sessions are validated dynamically. Registration requires real-time SMTP Gmail OTP verification to ensure only official NCPOR personnel gain system access.

## 📡 REST API Reference

The Polar Twin backend is strictly segregated into rapid telemetry streams ("Fast Lane") and standard transactional operations ("Slow Lane") to ensure zero latency during critical alerts. All secure routes require `HTTP-Only` JWTs and strict RBAC authorization.

### 🔐 Authentication & Security (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate operator and issue secure HTTP-only JWT |
| `POST` | `/api/auth/send-registration-otp` | Dispatch 6-digit email verification code via SMTP |
| `POST` | `/api/auth/register` | Register new personnel with OTP verification & avatar upload |
| `PUT` | `/api/auth/update-password` | Securely update operator credentials |

### ⚡ Telemetry Simulation - Fast Lane (`/api/telemetry`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/telemetry/{stationId}/live` | Retrieve full live simulated data (Energy, Env, Infra) |
| `GET` | `/api/telemetry/{stationId}/{section}/live` | Fetch isolated live metrics for a specific subsystem |

### 📦 Logistics & Requisitions - Slow Lane (`/api/orders` & `/api/logistics`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/logistics/{stationId}/data` | Fetch comprehensive station inventory ledgers and stock levels |
| `GET` | `/api/orders/{stationId}` | Query all active and historical supply requisitions |
| `POST` | `/api/orders/{stationId}/create` | Submit a formal supply requisition (Station Master) |
| `PUT` | `/api/orders/{stationId}/{orderId}/review` | Authority RBAC workflow to approve or reject requisitions |
| `PUT` | `/api/orders/{stationId}/{orderId}/deliver` | Update shipment transit status and finalize station delivery |
| `POST` | `/api/orders/{stationId}/direct-entry` | Direct inventory modification (bypass) for Logistics Operators |

### 📊 Executive Reporting (`/api/reports`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/reports/{stationId}?report_type=x` | Compile historical operational data for A4 PDF and CSV exports |

## 👥 Hackathon Team & Acknowledgements

- **Team Name**: **ORION**
- **Organization**: **BPPIMTSIH26** (B.P. Poddar Institute of Management and Technology)
- **Smart India Hackathon 2026**: Problem Statement **SIH26060**
- **Project Title**: NCPOR Polar Twin Command

### Team Structure & Contributions

#### 🌟 Core Project Leadership

- 👑 **Sayantan Pachal** ([@sayantan-pachal](https://github.com/sayantan-pachal)) - **Lead Architect, Full-Stack Developer & Simulation Engine Creator**
- ⚙️ **Shivam Gupta** ([@shiv2345king](https://github.com/shiv2345king)) - **Backend Infrastructure & Database Optimization Engineer**
- 🔍 **Shougata Sikder** ([@Shougata2003](https://github.com/Shougata2003)) - **Product Testing & Quality Assurance Lead**

#### ⚓ Engineering & Domain Specialists

- 🧮 **Ishika Chowdhury** ([@i5hika0x](https://github.com/i5hika0x)) - **Algorithmic Simulation & Event-Driven Systems Specialist**
- 🖥️ **Narayan Kumar Jha** ([@narayan-nkj](https://github.com/narayan-nkj)) - **Frontend Architecture & UI/UX Design Specialist**
- 📊 **Ahana** ([@I-Lawrence](https://github.com/I-Lawrence)) - **Telemetry Processing & Automated Reporting Specialist**

<br>

---

## 📄 License

**© 2026 ORION - B. P. Poddar Institute of Management & Technology. All Rights Reserved.**

This project and its source code are provided exclusively for the purposes of the **Smart India Hackathon 2026** evaluation and demonstration. 

**Proprietary Notice**
Unauthorized copying, modification, distribution, or commercial use of this repository's contents-including source code, 3D digital assets, and documentation-is strictly prohibited without prior written consent from the project authors. 

*Note: All third-party libraries, frameworks, open-source dependencies, and externally sourced 3D models used within this project remain subject to their respective original licenses.*

---

<div align="center">
  <p>
    <sub>Engineered with precision for Smart India Hackathon 2026. <b>NCPOR Polar Twin Command by ORION</b>.</sub><br />
    <sub>Documented by Sayantan Pachal</sub>
  </p>
</div>
