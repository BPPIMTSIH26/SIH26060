import StationMap from "./station/StationMap";
import HealthGauge from "./station/HealthGauge";
import AlertsList from "./station/AlertsList";

/* ============================================================
   STATION OVERVIEW

   Presentation component only.

   Backend data mapping should happen in Dashboard.jsx.
   ============================================================ */

export function StationOverview({
    activeStation,
    modules = [],
    health = {},
    alerts = [],
    environment = {},
}) {
    return (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">

            {/* ==================================================
                LEFT COLUMN: STATION MAP
               ================================================== */}

            <StationMap
                activeStation={activeStation}
                modules={modules}
                environment={environment}
            />

            {/* ==================================================
                RIGHT COLUMN: HEALTH + ALERTS
               ================================================== */}

            <div className="flex flex-col gap-4">

                <HealthGauge
                    health={health}
                />

                <AlertsList
                    alerts={alerts}
                />

            </div>

        </section>
    );
}