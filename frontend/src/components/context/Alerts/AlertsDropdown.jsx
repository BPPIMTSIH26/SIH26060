import {
    useState,
    useRef,
    useEffect,
} from "react";

import {
    Bell,
    AlertCircle,
    AlertTriangle,
    Info,
    X,
    CheckCircle2,
} from "lucide-react";

import { useGlobalAlert } from "./GlobalAlertContext";

/* ============================================================
   HELPERS
   ============================================================ */

const normalizeSeverity = (severity) => {
    if (!severity) return "INFO";

    return String(severity).toUpperCase();
};

const formatKeyLabel = (key) => {
    if (!key) return "";

    return String(key)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
};

const getAlertMessage = (alert) => {
    return (
        alert?.alert_message ||
        alert?.message ||
        alert?.description ||
        "System alert"
    );
};

const getAlertId = (alert, index = 0) => {
    return (
        alert?.alert_id ||
        alert?._id ||
        alert?.id ||
        `alert-${index}`
    );
};

const getFormattedTime = (alert) => {
    let diffMins =
        alert?.minutes_ago;

    if (alert?.timestamp) {
        const timestamp =
            new Date(alert.timestamp);

        const timestampValue =
            timestamp.getTime();

        if (!Number.isNaN(timestampValue)) {
            const diffMs =
                Date.now() -
                timestampValue;

            diffMins = Math.max(
                0,
                Math.floor(
                    diffMs / 60000
                )
            );
        }
    }

    if (
        diffMins === undefined ||
        diffMins === null ||
        Number.isNaN(Number(diffMins))
    ) {
        return "Just now";
    }

    diffMins = Number(diffMins);

    if (diffMins < 1) {
        return "Just now";
    }

    if (diffMins < 60) {
        return `${diffMins}m ago`;
    }

    const diffHours =
        Math.floor(diffMins / 60);

    if (diffHours < 24) {
        return `${diffHours}h ago`;
    }

    const diffDays =
        Math.floor(diffHours / 24);

    return `${diffDays}d ago`;
};

/* ============================================================
   COMPONENT
   ============================================================ */

export default function AlertsDropdown({
    activeStation,
}) {
    const { alerts = [] } =
        useGlobalAlert();

    const [alertsOpen, setAlertsOpen] =
        useState(false);

    const [expanded, setExpanded] =
        useState(false);

    const [readAlerts, setReadAlerts] =
        useState([]);

    const dropdownRef =
        useRef(null);

    /* ========================================================
       CLICK OUTSIDE
       ======================================================== */

    useEffect(() => {
        const handleClickOutside =
            (event) => {
                if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(
                        event.target
                    )
                ) {
                    setAlertsOpen(false);
                    setExpanded(false);
                }
            };

        if (alertsOpen) {
            document.addEventListener(
                "mousedown",
                handleClickOutside
            );
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [alertsOpen]);

    /* ========================================================
       NORMALIZE ALERTS
       ======================================================== */

    const normalizedAlerts =
        alerts.map((alert, index) => ({
            ...alert,
            alert_id:
                getAlertId(
                    alert,
                    index
                ),
            severity:
                normalizeSeverity(
                    alert?.severity
                ),
            message:
                getAlertMessage(alert),
        }));

    /* ========================================================
       ACTIVE ALERTS
       ======================================================== */

    const activeAlerts =
        normalizedAlerts.filter(
            (alert) =>
                !readAlerts.includes(
                    alert.alert_id
                )
        );

    const criticalCount =
        activeAlerts.filter(
            (alert) =>
                alert.severity ===
                "CRITICAL"
        ).length;

    const warningCount =
        activeAlerts.filter(
            (alert) =>
                alert.severity ===
                "WARNING"
        ).length;

    const totalAlerts =
        activeAlerts.length;

    const displayAlerts =
        expanded
            ? activeAlerts
            : activeAlerts.slice(0, 3);

    const hiddenCount =
        Math.max(
            0,
            totalAlerts - 3
        );

    /* ========================================================
       HIGHEST SEVERITY
       ======================================================== */

    const getHighestSeverity = () => {
        if (criticalCount > 0) {
            return "CRITICAL";
        }

        if (warningCount > 0) {
            return "WARNING";
        }

        return "INFO";
    };

    const highestSeverity =
        getHighestSeverity();

    /* ========================================================
       BADGE STYLES
       ======================================================== */

    const getBadgeStyle =
        (severity) => {
            switch (
                normalizeSeverity(
                    severity
                )
            ) {
                case "CRITICAL":
                    return "bg-red-500 text-white animate-pulse";

                case "WARNING":
                    return "bg-yellow-500 text-white";

                case "INFO":
                    return "bg-blue-500 text-white";

                default:
                    return "bg-gray-400 text-white";
            }
        };

    /* ========================================================
       ICON STYLES
       ======================================================== */

    const getAlertIconStyle =
        (severity) => {
            switch (
                normalizeSeverity(
                    severity
                )
            ) {
                case "CRITICAL":
                    return "text-red-600 dark:text-red-400";

                case "WARNING":
                    return "text-yellow-600 dark:text-yellow-400";

                case "INFO":
                    return "text-blue-600 dark:text-blue-400";

                default:
                    return "text-gray-600 dark:text-gray-400";
            }
        };

    /* ========================================================
       ALERT BACKGROUND
       ======================================================== */

    const getAlertBgStyle =
        (severity) => {
            switch (
                normalizeSeverity(
                    severity
                )
            ) {
                case "CRITICAL":
                    return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50";

                case "WARNING":
                    return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50";

                case "INFO":
                    return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50";

                default:
                    return "bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700/50";
            }
        };

    /* ========================================================
       MARK AS READ
       ======================================================== */

    const handleMarkAsRead =
        (alertId) => {
            if (!alertId) return;

            setReadAlerts(
                (previous) => {
                    if (
                        previous.includes(
                            alertId
                        )
                    ) {
                        return previous;
                    }

                    return [
                        ...previous,
                        alertId,
                    ];
                }
            );
        };

    /* ========================================================
       RENDER
       ======================================================== */

    return (
        <div
            className="relative font-sans"
            ref={dropdownRef}
        >
            {/* =================================================
                BELL BUTTON
               ================================================= */}

            <button
                onClick={() => {
                    setAlertsOpen(
                        (previous) =>
                            !previous
                    );

                    if (alertsOpen) {
                        setExpanded(false);
                    }
                }}
                className="relative p-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                aria-label="Alerts"
                aria-expanded={
                    alertsOpen
                }
            >
                <Bell className="w-5 h-5" />

                {totalAlerts > 0 && (
                    <span
                        className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${getBadgeStyle(
                            highestSeverity
                        )}`}
                    >
                        {totalAlerts > 9
                            ? "9+"
                            : totalAlerts}
                    </span>
                )}
            </button>

            {/* =================================================
                DROPDOWN
               ================================================= */}

            {alertsOpen && (
                <div className="absolute right-0 sm:right-0 left-[-220px] sm:left-auto top-12 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 transition-colors">

                    {/* HEADER */}

                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">

                        <div>

                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                Station Alerts
                                {activeStation
                                    ? ` - ${activeStation}`
                                    : ""}
                            </h3>

                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                {totalAlerts} active
                                alert
                                {totalAlerts !==
                                1
                                    ? "s"
                                    : ""}
                            </p>

                        </div>

                        <button
                            onClick={() => {
                                setAlertsOpen(
                                    false
                                );
                                setExpanded(
                                    false
                                );
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                            aria-label="Close alerts"
                        >
                            <X className="w-4 h-4" />
                        </button>

                    </div>

                    {/* ALERT LIST */}

                    <div className="max-h-[28rem] overflow-y-auto">

                        {totalAlerts ===
                        0 ? (
                            <div className="px-4 py-8 text-center">

                                <div className="text-gray-400 dark:text-slate-500 mb-2">
                                    <CheckCircle2 className="w-8 h-8 mx-auto opacity-50 text-emerald-500" />
                                </div>

                                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                                    You're all caught up
                                </p>

                                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                                    All systems operating normally
                                </p>

                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-slate-700">

                                {displayAlerts.map(
                                    (
                                        alert
                                    ) => {

                                        const severity =
                                            normalizeSeverity(
                                                alert.severity
                                            );

                                        const alertId =
                                            alert.alert_id;

                                        return (
                                            <div
                                                key={
                                                    alertId
                                                }
                                                className={`px-4 py-3 border-l-4 transition-colors ${getAlertBgStyle(
                                                    severity
                                                )} ${
                                                    severity ===
                                                    "CRITICAL"
                                                        ? "border-l-red-600 dark:border-l-red-400"
                                                        : severity ===
                                                          "WARNING"
                                                            ? "border-l-yellow-600 dark:border-l-yellow-400"
                                                            : "border-l-blue-600 dark:border-l-blue-400"
                                                }`}
                                            >

                                                {/* TOP */}

                                                <div className="flex items-start justify-between mb-2">

                                                    <div className="flex items-start gap-2 flex-1">

                                                        {severity ===
                                                        "CRITICAL" ? (
                                                            <AlertCircle
                                                                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getAlertIconStyle(
                                                                    severity
                                                                )}`}
                                                            />
                                                        ) : severity ===
                                                          "WARNING" ? (
                                                            <AlertTriangle
                                                                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getAlertIconStyle(
                                                                    severity
                                                                )}`}
                                                            />
                                                        ) : (
                                                            <Info
                                                                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getAlertIconStyle(
                                                                    severity
                                                                )}`}
                                                            />
                                                        )}

                                                        <div className="flex-1 min-w-0">

                                                            <div className="flex items-center justify-between gap-2">

                                                                <div className="flex items-center gap-2">

                                                                    <span
                                                                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                                                            severity ===
                                                                            "CRITICAL"
                                                                                ? "bg-red-600 text-white"
                                                                                : severity ===
                                                                                  "WARNING"
                                                                                    ? "bg-yellow-600 text-white"
                                                                                    : "bg-blue-600 text-white"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            severity
                                                                        }
                                                                    </span>

                                                                    <span className="text-xs text-gray-400 dark:text-slate-500">
                                                                        {getFormattedTime(
                                                                            alert
                                                                        )}
                                                                    </span>

                                                                </div>

                                                            </div>

                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1 break-words">
                                                                {
                                                                    alert.message
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                                {/* SOURCE */}

                                                {(alert.module ||
                                                    alert.source) && (
                                                    <div className="mb-2 ml-6">
                                                        <p className="text-xs text-gray-600 dark:text-slate-400">
                                                            <span className="font-semibold">
                                                                Source:
                                                            </span>{" "}
                                                            {formatKeyLabel(
                                                                alert.module ||
                                                                    alert.source
                                                            )}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* AFFECTED SYSTEMS */}

                                                {Array.isArray(
                                                    alert.affected_systems
                                                ) &&
                                                    alert
                                                        .affected_systems
                                                        .length >
                                                        0 && (
                                                        <div className="mb-2 ml-6">

                                                            <p className="text-xs text-gray-600 dark:text-slate-400">

                                                                <span className="font-semibold">
                                                                    Affected:
                                                                </span>{" "}

                                                                {alert.affected_systems
                                                                    .map(
                                                                        formatKeyLabel
                                                                    )
                                                                    .join(
                                                                        ", "
                                                                    )}

                                                            </p>

                                                        </div>
                                                    )}

                                                {/* CURRENT STATE */}

                                                {alert.current_state &&
                                                    typeof alert.current_state ===
                                                        "object" && (
                                                        <div className="mb-2 ml-6 text-xs text-gray-600 dark:text-slate-400 space-y-0.5">

                                                            {Object.entries(
                                                                alert.current_state
                                                            )
                                                                .slice(
                                                                    0,
                                                                    3
                                                                )
                                                                .map(
                                                                    ([
                                                                        key,
                                                                        value,
                                                                    ]) => (
                                                                        <p
                                                                            key={
                                                                                key
                                                                            }
                                                                        >
                                                                            <span className="font-semibold">
                                                                                {formatKeyLabel(
                                                                                    key
                                                                                )}
                                                                                :
                                                                            </span>{" "}
                                                                            {typeof value ===
                                                                            "number"
                                                                                ? value.toFixed(
                                                                                      1
                                                                                  )
                                                                                : String(
                                                                                      value
                                                                                  )}
                                                                        </p>
                                                                    )
                                                                )}

                                                        </div>
                                                    )}

                                                {/* RECOMMENDED ACTIONS */}

                                                {Array.isArray(
                                                    alert.recommended_actions
                                                ) &&
                                                    alert
                                                        .recommended_actions
                                                        .length >
                                                        0 && (
                                                        <div className="mt-2 ml-6 text-xs">

                                                            <p className="font-semibold text-gray-700 dark:text-slate-300 mb-1">
                                                                Recommended
                                                                Actions:
                                                            </p>

                                                            <ul className="space-y-1 mb-2">

                                                                {alert.recommended_actions
                                                                    .slice(
                                                                        0,
                                                                        2
                                                                    )
                                                                    .map(
                                                                        (
                                                                            action,
                                                                            index
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="text-gray-600 dark:text-slate-400 flex items-start gap-2"
                                                                            >

                                                                                <span className="font-bold text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5">
                                                                                    {index +
                                                                                        1}
                                                                                    .
                                                                                </span>

                                                                                <span className="flex-1">

                                                                                    {typeof action ===
                                                                                    "string"
                                                                                        ? action
                                                                                        : action?.description ||
                                                                                          action?.action ||
                                                                                          "Review system status"}

                                                                                </span>

                                                                            </li>
                                                                        )
                                                                    )}

                                                            </ul>

                                                        </div>
                                                    )}

                                                {/* MARK READ */}

                                                <div className="mt-3 ml-6 flex justify-end">

                                                    <button
                                                        onClick={() =>
                                                            handleMarkAsRead(
                                                                alertId
                                                            )
                                                        }
                                                        className="text-[0.65rem] uppercase tracking-wider font-bold text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Mark as Read
                                                    </button>

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </div>

                    {/* MORE */}

                    {totalAlerts >
                        3 && (
                        <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">

                            <button
                                onClick={() =>
                                    setExpanded(
                                        !expanded
                                    )
                                }
                                className="w-full text-center text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors py-1"
                            >
                                {expanded
                                    ? "Show Less ▴"
                                    : `View ${hiddenCount} More Alert${
                                          hiddenCount !==
                                          1
                                              ? "s"
                                              : ""
                                      } ▾`}
                            </button>

                        </div>
                    )}

                </div>
            )}
        </div>
    );
}