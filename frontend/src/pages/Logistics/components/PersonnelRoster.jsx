
import { UserMinus, Activity } from "lucide-react";

export default function PersonnelRoster({ logisticsJson }) {
  if (!logisticsJson || !logisticsJson.personnel) return null;

  const { personnel } = logisticsJson;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-100 dark:bg-slate-900/40 p-5 transition-colors duration-300">
      <div className="mb-6 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-900 dark:text-slate-100">Personnel Manifest</h3>
        <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400">Total Active: {personnel.on_station_count}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Role Breakdown */}
        <div className="sm:col-span-2">
          <h4 className="font-mono text-[0.65rem] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-3">Crew Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(personnel.breakdown).map(([role, count]) => (
              <div key={role} className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50">
                <span className="font-mono text-xl font-bold text-gray-900 dark:text-slate-100">{count}</span>
                <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center mt-1">
                  {role.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status / Departures */}
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-[0.65rem] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-1">Movements & Status</h4>
          
          <div className="flex items-center justify-between p-3 rounded-lg border border-cyan-200 dark:border-cyan-900/30 bg-cyan-50 dark:bg-cyan-950/20">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-600 dark:text-cyan-500" />
              <span className="font-mono text-xs font-bold text-gray-900 dark:text-slate-100">Field Teams</span>
            </div>
            <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-500">{personnel.field_teams_active} Active</span>
          </div>

          {personnel.departing_personnel.map((person, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-slate-700/50 bg-white/60 dark:bg-slate-950/50">
              <div className="flex items-center gap-2">
                <UserMinus className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="font-mono text-[0.65rem] font-bold text-gray-900 dark:text-slate-100">{person.name}</p>
                  <p className="font-mono text-[0.6rem] text-gray-500 dark:text-slate-400">{person.role}</p>
                </div>
              </div>
              <span className="font-mono text-[0.6rem] uppercase tracking-wider text-amber-600 dark:text-amber-500">
                Departs {person.departure_date.slice(5)}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}