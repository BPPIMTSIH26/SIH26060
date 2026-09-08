import { ShieldAlert, AlertOctagon, BellRing } from "lucide-react";

export default function EmergencyScenarios({ environmentJson }) {
  if (!environmentJson || !environmentJson.emergencyScenarios) {
    return null;
  }

  const {
    emergencyScenarios,
    alertsLocal = [],
  } = environmentJson;

  const blizzard =
    emergencyScenarios?.scenarioBlizzardLockdown;

  const extremeCold =
    emergencyScenarios?.scenarioExtremeCold;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 flex flex-col h-full font-sans">

      {/* Header */}
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Emergency Protocols
        </h3>

        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Live Triggers
        </span>
      </div>

      <div className="flex-1 space-y-3">

        {/* Active Local Alerts */}
        {alertsLocal.length > 0 &&
          alertsLocal.map((alert, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30 p-3.5 shadow-sm"
            >
              <BellRing className="h-4 w-4 text-red-600 dark:text-red-500 mt-0.5 shrink-0 animate-pulse" />

              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Active Alert
                </p>

                <p className="text-[0.65rem] font-medium text-red-700 dark:text-red-400 mt-1.5">
                  {alert?.message || "Emergency alert active"}
                </p>

                {alert?.severity && (
                  <p className="text-[0.6rem] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mt-1">
                    Severity: {alert.severity}
                  </p>
                )}
              </div>
            </div>
          ))}

        {/* Blizzard Lockdown */}
        {blizzard && (
          <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">

            <ShieldAlert
              className={`h-4 w-4 mt-0.5 shrink-0 ${
                blizzard.currentStatus === "not_triggered"
                  ? "text-emerald-500"
                  : "text-red-500"
              }`}
            />

            <div className="w-full">
              <div className="flex justify-between items-center mb-1.5">

                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Blizzard Lockdown
                </p>

                <span
                  className={`text-[0.6rem] font-bold uppercase tracking-wider ${
                    blizzard.currentStatus === "not_triggered"
                      ? "text-emerald-600 dark:text-emerald-500"
                      : "text-red-600 dark:text-red-500"
                  }`}
                >
                  {blizzard.currentStatus
                    ?.replace(/_/g, " ")
                    || "unknown"}
                </span>

              </div>

              <p className="text-[0.65rem] font-medium text-slate-500 dark:text-slate-400">
                Trigger:{" "}
                <span className="font-mono">
                  Wind &gt; {blizzard.triggerThresholdWind ?? "N/A"} km/h
                </span>{" "}
                &{" "}
                <span className="font-mono">
                  Vis &lt; {blizzard.triggerThresholdVisibility ?? "N/A"} m
                </span>
              </p>

              {blizzard.estimatedEffect && (
                <p className="text-[0.65rem] text-slate-500 dark:text-slate-400 mt-1.5">
                  Effect: {blizzard.estimatedEffect}
                </p>
              )}

            </div>
          </div>
        )}

        {/* Extreme Cold Protocol */}
        {extremeCold && (
          <div className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 p-3.5 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors">

            <AlertOctagon
              className={`h-4 w-4 mt-0.5 shrink-0 ${
                extremeCold.likelihood === "low"
                  ? "text-emerald-500"
                  : extremeCold.likelihood === "high"
                    ? "text-red-500"
                    : "text-amber-500"
              }`}
            />

            <div className="w-full">
              <div className="flex justify-between items-center mb-1.5">

                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Extreme Cold Stress
                </p>

                <span
                  className={`text-[0.6rem] font-bold uppercase tracking-wider ${
                    extremeCold.likelihood === "low"
                      ? "text-emerald-600 dark:text-emerald-500"
                      : extremeCold.likelihood === "high"
                        ? "text-red-600 dark:text-red-500"
                        : "text-amber-600 dark:text-amber-500"
                  }`}
                >
                  Risk: {extremeCold.likelihood || "unknown"}
                </span>

              </div>

              <p className="text-[0.65rem] font-medium text-slate-500 dark:text-slate-400">
                {extremeCold.estimatedEffect || "No estimated effect available"}
              </p>

              {extremeCold.triggerThresholdTemp !== undefined && (
                <p className="text-[0.65rem] font-mono text-slate-500 dark:text-slate-400 mt-1.5">
                  Trigger: {extremeCold.triggerThresholdTemp}°C
                </p>
              )}

            </div>
          </div>
        )}

        {/* No emergency data */}
        {!blizzard &&
          !extremeCold &&
          alertsLocal.length === 0 && (
            <div className="flex items-center justify-center min-h-[150px]">
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                No active emergency scenarios.
              </p>
            </div>
          )}

      </div>
    </div>
  );
}