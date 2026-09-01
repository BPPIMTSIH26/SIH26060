import { useState, useRef, useEffect } from 'react';
import { Bell, AlertCircle, AlertTriangle, Info, X, CheckCircle2 } from 'lucide-react';
import { useGlobalAlert } from './GlobalAlertContext';

export default function AlertsDropdown({ activeStation }) {
  const { alerts } = useGlobalAlert(); 
  
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [readAlerts, setReadAlerts] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAlertsOpen(false);
        setExpanded(false);
      }
    };

    if (alertsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [alertsOpen]);

  const activeAlerts = alerts.filter(a => !readAlerts.includes(a.alert_id));

  const criticalCount = activeAlerts.filter(a => a.severity === "CRITICAL").length;
  const warningCount = activeAlerts.filter(a => a.severity === "WARNING").length;
  const totalAlerts = activeAlerts.length;

  const displayAlerts = expanded ? activeAlerts : activeAlerts.slice(0, 3);
  const hiddenCount = totalAlerts - 3;

  const getHighestSeverity = () => {
    if (criticalCount > 0) return "CRITICAL";
    if (warningCount > 0) return "WARNING";
    return "INFO";
  };

  const highestSeverity = getHighestSeverity();

  const getBadgeStyle = (severity) => {
    switch(severity) {
      case "CRITICAL": return "bg-red-500 text-white animate-pulse";
      case "WARNING": return "bg-yellow-500 text-white";
      case "INFO": return "bg-blue-500 text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  const getAlertIconStyle = (severity) => {
    switch(severity) {
      case "CRITICAL": return "text-red-600 dark:text-red-400";
      case "WARNING": return "text-yellow-600 dark:text-yellow-400";
      case "INFO": return "text-blue-600 dark:text-blue-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getAlertBgStyle = (severity) => {
    switch(severity) {
      case "CRITICAL": return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50";
      case "WARNING": return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50";
      case "INFO": return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50";
      default: return "bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700/50";
    }
  };

  const handleMarkAsRead = (alertId) => {
    setReadAlerts(prev => [...prev, alertId]);
  };

  // Helper to format keys like "battery_backup" into "Battery Backup"
  const formatKeyLabel = (key) => {
    if (!key) return "";
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // =========================================================================
  // DYNAMIC TIME CONVERTER (Minutes -> Hours -> Days)
  // =========================================================================
  const getFormattedTime = (alert) => {
    let diffMins = alert.minutes_ago;

    if (alert.timestamp) {
        const diffMs = new Date() - new Date(alert.timestamp);
        diffMins = Math.max(0, Math.floor(diffMs / 60000));
    }

    if (diffMins === undefined || diffMins === null || isNaN(diffMins)) {
        return "Just now";
    }

    if (diffMins < 1) {
        return "Just now";
    }
    if (diffMins < 60) {
        return `${diffMins}m ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
        return `${diffHours}h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button
        onClick={() => {
          setAlertsOpen(!alertsOpen);
          if (alertsOpen) setExpanded(false);
        }}
        className="relative p-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
        aria-label="Alerts"
        aria-expanded={alertsOpen}
      >
        <Bell className="w-5 h-5" />
        
        {totalAlerts > 0 && (
          <span className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${getBadgeStyle(highestSeverity)}`}>
            {totalAlerts > 9 ? '9+' : totalAlerts}
          </span>
        )}
      </button>

      {/* Alerts Floating Window - Optimized with responsive sizing for mobile */}
      {alertsOpen && (
        <div className="absolute right-0 sm:right-0 left-[-220px] sm:left-auto top-12 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 transition-colors">
          
          <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Station Alerts - {activeStation}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                {totalAlerts} active alert{totalAlerts !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => {
                setAlertsOpen(false);
                setExpanded(false);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-[28rem] overflow-y-auto">
            {totalAlerts === 0 ? (
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
                {displayAlerts.map((alert) => (
                  <div
                    key={alert.alert_id}
                    className={`px-4 py-3 border-l-4 transition-colors ${getAlertBgStyle(alert.severity)} ${
                      alert.severity === "CRITICAL"
                        ? "border-l-red-600 dark:border-l-red-400"
                        : alert.severity === "WARNING"
                        ? "border-l-yellow-600 dark:border-l-yellow-400"
                        : "border-l-blue-600 dark:border-l-blue-400"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-2 flex-1">
                        {alert.severity === "CRITICAL" ? (
                          <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getAlertIconStyle(alert.severity)}`} />
                        ) : alert.severity === "WARNING" ? (
                          <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getAlertIconStyle(alert.severity)}`} />
                        ) : (
                          <Info className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getAlertIconStyle(alert.severity)}`} />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                alert.severity === "CRITICAL"
                                  ? "bg-red-600 text-white"
                                  : alert.severity === "WARNING"
                                  ? "bg-yellow-600 text-white"
                                  : "bg-blue-600 text-white"
                              }`}>
                                {alert.severity}
                              </span>
                              <span className="text-xs text-gray-400 dark:text-slate-500">
                                {getFormattedTime(alert)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1 break-words">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    {alert.affected_systems && (
                      <div className="mb-2 ml-6">
                        <p className="text-xs text-gray-600 dark:text-slate-400">
                          {/* CRITICAL FIX: Mapping formatKeyLabel over the array before joining */}
                          <span className="font-semibold">Affected:</span> {alert.affected_systems.map(formatKeyLabel).join(", ")}
                        </p>
                      </div>
                    )}

                    {alert.current_state && (
                      <div className="mb-2 ml-6 text-xs text-gray-600 dark:text-slate-400 space-y-0.5">
                        {Object.entries(alert.current_state).slice(0, 3).map(([key, value]) => (
                          <p key={key}>
                            <span className="font-semibold">{formatKeyLabel(key)}:</span> {
                              typeof value === 'number' ? value.toFixed(1) : String(value)
                            }
                          </p>
                        ))}
                      </div>
                    )}

                    {alert.recommended_actions && alert.recommended_actions.length > 0 && (
                      <div className="mt-2 ml-6 text-xs">
                        <p className="font-semibold text-gray-700 dark:text-slate-300 mb-1">
                          Recommended Actions:
                        </p>
                        <ul className="space-y-1 mb-2">
                          {alert.recommended_actions.slice(0, 2).map((action, idx) => (
                            <li key={idx} className="text-gray-600 dark:text-slate-400 flex items-start gap-2">
                              <span className="font-bold text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5">
                                {idx + 1}.
                              </span>
                              <span className="flex-1">
                                {typeof action === 'string' ? action : action.description || action.action}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-3 ml-6 flex justify-end">
                      <button
                        onClick={() => handleMarkAsRead(alert.alert_id)}
                        className="text-[0.65rem] uppercase tracking-wider font-bold text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Read
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {totalAlerts > 3 && (
            <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
              <button 
                onClick={() => setExpanded(!expanded)}
                className="w-full text-center text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors py-1"
              >
                {expanded ? "Show Less ▴" : `View ${hiddenCount} More Alert${hiddenCount !== 1 ? 's' : ''} ▾`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}