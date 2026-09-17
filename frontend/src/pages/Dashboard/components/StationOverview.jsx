import StationMap from "./station/StationMap";
import HealthGauge from "./station/HealthGauge";
import AlertsList from "./station/AlertsList";

// Ensure activeStation receives the prop from Dashboard.jsx
export function StationOverview({ activeStation, modules = [], health = {}, alerts = [], environment = {} }) {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      
      {/* Left Column: The Map */}
      <StationMap 
        activeStation={activeStation} 
        modules={modules} 
        environment={environment} 
      />
      
      {/* Right Column: Gauge and Alerts Stacked */}
      <div className="flex flex-col gap-4">
        <HealthGauge health={health} />
        <AlertsList alerts={alerts} />
      </div>
    </section>
  );
}