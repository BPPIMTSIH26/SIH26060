import { UserMinus, Activity } from "lucide-react";

export default function PersonnelRoster({ logisticsJson }) {
  if (!logisticsJson || !logisticsJson.personnel) return null;

  const { personnel } = logisticsJson;

  // Defensive programming: Provide safe fallbacks if the backend data is missing
  const activeCount = personnel.on_station_count || personnel.active_count || 0;
  const breakdown = personnel.breakdown || {};
  const fieldTeamsActive = personnel.field_teams_active || 0;
  const departingPersonnel = personnel.departing_personnel || [];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 transition-colors duration-300 font-sans">
      <div className="mb-6 flex items-baseline justify-between">
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">Personnel Manifest</h3>
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Active: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{activeCount}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Role Breakdown */}
        <div className="sm:col-span-2">
          <h4 className="text-[0.65rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Crew Breakdown</h4>
          
          {Object.keys(breakdown).length === 0 ? (
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 py-4">
                No breakdown data available.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(breakdown).map(([role, count]) => (
                <div key={role} className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-colors">
                  <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100">{count}</span>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center mt-1.5">
                    {role.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status / Departures */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[0.65rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Movements & Status</h4>
          
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-cyan-200/80 dark:border-cyan-900/40 bg-cyan-50/80 dark:bg-cyan-950/30">
            <div className="flex items-center gap-2.5">
              <Activity className="h-4 w-4 text-cyan-600 dark:text-cyan-500 shrink-0" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Field Teams</span>
            </div>
            <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-500">{fieldTeamsActive} Active</span>
          </div>

          {departingPersonnel.length === 0 ? (
             <div className="text-xs font-medium text-slate-500 dark:text-slate-400 italic px-1 pt-2">
                 No impending departures.
             </div>
          ) : (
              departingPersonnel.map((person, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <UserMinus className="h-4 w-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{person.name}</p>
                      <p className="text-[0.6rem] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{person.role}</p>
                    </div>
                  </div>
                  <span className="text-[0.6rem] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 text-right leading-tight">
                    Departs<br/>
                    <span className="font-mono text-xs">{person.departure_date ? person.departure_date.slice(5) : "TBD"}</span>
                  </span>
                </div>
              ))
          )}
        </div>

      </div>
    </div>
  );
}