import { AlertTriangle, ZapOff } from "lucide-react";

export default function GridAlerts({ energyJson }) {
  if (!energyJson || !energyJson.interconnections) return null;
  const alert = energyJson.interconnections;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 flex flex-col h-full font-sans">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Grid Interconnections</h3>
        <span className={`text-[0.65rem] uppercase tracking-wider font-bold ${alert.severity === 'WARNING' ? 'text-red-500' : 'text-emerald-500'}`}>
          {alert.severity}
        </span>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30 p-3.5 shadow-sm flex-1">
          <ZapOff className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5 shrink-0 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">{alert.critical_alert.replace(/_/g, ' ')}</p>
            <p className="text-[0.7rem] font-medium text-red-800 dark:text-red-400 leading-relaxed mb-2.5">{alert.alert_description}</p>
            <div className="inline-flex items-center rounded-md bg-red-100 dark:bg-red-900/50 px-2.5 py-1.5 border border-red-200 dark:border-red-800">
              <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400 mr-1.5 shrink-0" />
              <span className="text-[0.65rem] font-bold text-red-700 dark:text-red-300 uppercase tracking-wider">Action: {alert.recommended_action}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}