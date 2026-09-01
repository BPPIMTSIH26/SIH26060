/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { alertsAPI } from "../../../services/alerts";

const GlobalAlertContext = createContext();

const ENABLE_MOCK_ALERTS = true; 

export const GlobalAlertProvider = ({ children, activeStation = "Maitri" }) => {
    const [alerts, setAlerts] = useState([]);
    const [bannerAlert, setBannerAlert] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchAlertsFromAPI = async () => {
            if (!ENABLE_MOCK_ALERTS) return;

            try {
                const res = await alertsAPI.getStationAlerts(activeStation);
                if (!isMounted) return;

                const fetchedAlerts = res.data?.active_alerts || [];
                
                // Format the JSON schema and compute real-time minutes elapsed from timestamps
                const formattedAlerts = fetchedAlerts.map(a => {
                    let minsAgo = a.minutes_ago;
                    if (a.timestamp) {
                        const diffMs = new Date() - new Date(a.timestamp);
                        minsAgo = Math.max(0, Math.floor(diffMs / 60000));
                    }
                    return {
                        ...a,
                        message: a.alert_message || a.message,
                        minutes_ago: minsAgo
                    };
                });

                setAlerts(formattedAlerts);

                const criticalAlerts = formattedAlerts.filter(a => a.severity === "CRITICAL");
                if (criticalAlerts.length > 0) {
                    const highestPriority = criticalAlerts[0];
                    setBannerAlert((prev) => 
                        prev?.alert_id !== highestPriority.alert_id ? highestPriority : prev
                    );
                }
            } catch (error) {
                console.error("Failed to fetch alerts:", error);
            }
        };

        fetchAlertsFromAPI();
        const interval = setInterval(fetchAlertsFromAPI, 10000); 
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [activeStation]);

    const dismissBanner = useCallback(() => {
        setBannerAlert(null);
    }, []);

    const pushAlert = useCallback((newAlert) => {
        setAlerts((prev) => {
            if (prev.find(a => a.alert_id === newAlert.alert_id)) return prev;
            return [newAlert, ...prev];
        });
        
        if (newAlert.severity === "CRITICAL") {
            setBannerAlert(newAlert);
        }
    }, []);

    return (
        <GlobalAlertContext.Provider value={{ alerts, bannerAlert, dismissBanner, pushAlert }}>
            {children}
        </GlobalAlertContext.Provider>
    );
};

export const useGlobalAlert = () => useContext(GlobalAlertContext);