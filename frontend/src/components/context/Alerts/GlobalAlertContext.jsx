/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

import {
    alertsAPI,
} from "../../../services/api/alerts.js";

const GlobalAlertContext =
    createContext(null);

/* ============================================================
   CONFIG
   ============================================================ */

/*
 * Alerts now use the real backend API.
 *
 * Rename this only if you actually want to
 * add a mock-data implementation later.
 */
const ENABLE_ALERT_API = true;

const REFRESH_INTERVAL = 10000;

/* ============================================================
   HELPERS
   ============================================================ */

const normalizeSeverity = (
    severity
) => {
    if (!severity) {
        return "INFO";
    }

    return String(
        severity
    ).toUpperCase();
};

const getAlertId = (
    alert,
    index = 0
) => {
    return (
        alert?.alert_id ||
        alert?._id ||
        alert?.id ||
        `alert-${index}`
    );
};

const getAlertMessage = (
    alert
) => {
    return (
        alert?.alert_message ||
        alert?.message ||
        alert?.description ||
        "System alert"
    );
};

const normalizeAlert = (
    alert,
    index = 0
) => {
    const normalizedId =
        getAlertId(
            alert,
            index
        );

    return {
        ...alert,

        alert_id:
            normalizedId,

        severity:
            normalizeSeverity(
                alert?.severity
            ),

        message:
            getAlertMessage(alert),

        minutes_ago:
            alert?.timestamp
                ? calculateMinutesAgo(
                      alert.timestamp
                  )
                : alert?.minutes_ago,

        affected_systems:
            Array.isArray(
                alert?.affected_systems
            )
                ? alert.affected_systems
                : [],

        recommended_actions:
            Array.isArray(
                alert?.recommended_actions
            )
                ? alert.recommended_actions
                : [],
    };
};

const calculateMinutesAgo = (
    timestamp
) => {
    const date =
        new Date(timestamp);

    const time =
        date.getTime();

    if (
        Number.isNaN(time)
    ) {
        return undefined;
    }

    const diff =
        Date.now() - time;

    return Math.max(
        0,
        Math.floor(
            diff / 60000
        )
    );
};

/* ============================================================
   PROVIDER
   ============================================================ */

export const GlobalAlertProvider = ({
    children,
    activeStation = "Maitri",
}) => {
    const [alerts, setAlerts] =
        useState([]);

    const [bannerAlert, setBannerAlert] =
        useState(null);

    /* ========================================================
       FETCH ALERTS
       ======================================================== */

    const fetchAlertsFromAPI =
        useCallback(
            async () => {
                if (
                    !ENABLE_ALERT_API
                ) {
                    return;
                }

                try {
                    const response =
                        await alertsAPI.getStationAlerts(
                            activeStation
                        );

                    const fetchedAlerts =
                        response?.data
                            ?.active_alerts ||
                        response?.active_alerts ||
                        [];

                    const normalizedAlerts =
                        fetchedAlerts.map(
                            normalizeAlert
                        );

                    /*
                     * Remove duplicate alert IDs.
                     */

                    const uniqueAlerts =
                        Array.from(
                            new Map(
                                normalizedAlerts.map(
                                    (
                                        alert
                                    ) => [
                                        alert.alert_id,
                                        alert,
                                    ]
                                )
                            ).values()
                        );

                    setAlerts(
                        uniqueAlerts
                    );

                    /*
                     * Select the highest-priority
                     * critical alert.
                     */

                    const criticalAlerts =
                        uniqueAlerts.filter(
                            (alert) =>
                                alert.severity ===
                                "CRITICAL"
                        );

                    if (
                        criticalAlerts.length >
                        0
                    ) {
                        setBannerAlert(
                            (previous) => {
                                const highestPriority =
                                    criticalAlerts[0];

                                /*
                                 * Do not unnecessarily replace
                                 * the current banner with the
                                 * same alert every polling cycle.
                                 */

                                if (
                                    previous?.alert_id ===
                                    highestPriority.alert_id
                                ) {
                                    return previous;
                                }

                                return highestPriority;
                            }
                        );
                    } else {
                        /*
                         * No critical alert exists anymore.
                         * Remove stale banner.
                         */
                        setBannerAlert(
                            null
                        );
                    }
                } catch (
                    error
                ) {
                    console.error(
                        "Failed to fetch alerts:",
                        error
                    );
                }
            },
            [activeStation]
        );

    /* ========================================================
       POLLING
       ======================================================== */

    useEffect(() => {
        let isMounted =
            true;

        const loadAlerts =
            async () => {
                if (
                    !isMounted
                ) {
                    return;
                }

                await fetchAlertsFromAPI();
            };

        loadAlerts();

        const interval =
            setInterval(
                loadAlerts,
                REFRESH_INTERVAL
            );

        return () => {
            isMounted = false;
            clearInterval(
                interval
            );
        };
    }, [
        fetchAlertsFromAPI,
    ]);

    /* ========================================================
       STATION CHANGE
       ======================================================== */

    useEffect(() => {
        /*
         * Do not show the previous station's
         * banner while the new station is loading.
         */
        setBannerAlert(null);
        setAlerts([]);
    }, [activeStation]);

    /* ========================================================
       DISMISS BANNER
       ======================================================== */

    const dismissBanner =
        useCallback(() => {
            setBannerAlert(null);
        }, []);

    /* ========================================================
       PUSH LOCAL ALERT
       ======================================================== */

    const pushAlert =
        useCallback(
            (newAlert) => {
                if (!newAlert) {
                    return;
                }

                const normalized =
                    normalizeAlert(
                        newAlert
                    );

                setAlerts(
                    (previous) => {
                        const exists =
                            previous.some(
                                (alert) =>
                                    alert.alert_id ===
                                    normalized.alert_id
                            );

                        if (exists) {
                            return previous;
                        }

                        return [
                            normalized,
                            ...previous,
                        ];
                    }
                );

                if (
                    normalized.severity ===
                    "CRITICAL"
                ) {
                    setBannerAlert(
                        normalized
                    );
                }
            },
            []
        );

    /* ========================================================
       CONTEXT VALUE
       ======================================================== */

    return (
        <GlobalAlertContext.Provider
            value={{
                alerts,
                bannerAlert,
                dismissBanner,
                pushAlert,
                refreshAlerts:
                    fetchAlertsFromAPI,
            }}
        >
            {children}
        </GlobalAlertContext.Provider>
    );
};

/* ============================================================
   HOOK
   ============================================================ */

export const useGlobalAlert =
    () => {
        const context =
            useContext(
                GlobalAlertContext
            );

        if (!context) {
            throw new Error(
                "useGlobalAlert must be used inside GlobalAlertProvider"
            );
        }

        return context;
    };