import React from 'react';

export default function StationBlueprint({ stationState }) {
  // Helper function to map data to Tailwind colors
  const getStatusColor = (status) => {
    if (status === 'CRITICAL') return 'fill-red-500 animate-pulse';
    if (status === 'WARNING') return 'fill-yellow-400';
    return 'fill-emerald-500'; // Normal
  };

  return (
    <div className="w-full bg-slate-900 p-4 rounded-xl border border-slate-700">
      <h3 className="text-white mb-4 font-mono">Maitri Station - Schematic Topology</h3>
      
      {/* The SVG Canvas */}
      <svg viewBox="0 0 800 500" className="w-full h-auto drop-shadow-lg">
        
        {/* Background Grid (Optional, makes it look technical) */}
        <rect width="800" height="500" fill="#0f172a" />

        {/* --- CORRIDORS (Connecting the blocks) --- */}
        <path d="M 400 150 L 400 350 M 250 250 L 550 250" 
              stroke="#334155" strokeWidth="15" />

        {/* --- MODULE 1: MAIN LIVING QUARTERS --- */}
        <rect x="300" y="200" width="200" height="100" rx="4" 
              className={`stroke-slate-400 stroke-2 transition-colors duration-500 ${getStatusColor(stationState.livingQuarters)}`} />
        <text x="400" y="255" fill="white" textAnchor="middle" className="font-bold text-sm pointer-events-none">
          LIVING QUARTERS
        </text>

        {/* --- MODULE 2: GENERATOR & POWER ROOM --- */}
        <rect x="550" y="200" width="150" height="100" rx="4"
              className={`stroke-slate-400 stroke-2 transition-colors duration-500 ${getStatusColor(stationState.generatorRoom)}`} 
              onClick={() => alert("Open Generator Modal")} /> {/* Example of interactivity */}
        <text x="625" y="255" fill="white" textAnchor="middle" className="font-bold text-sm pointer-events-none">
          POWER GRID
        </text>

        {/* --- MODULE 3: COMMS DOME --- */}
        <circle cx="200" cy="250" r="60" 
                className={`stroke-slate-400 stroke-2 transition-colors duration-500 ${getStatusColor(stationState.commsDome)}`} />
        <text x="200" y="255" fill="white" textAnchor="middle" className="font-bold text-sm pointer-events-none">
          COMMS
        </text>

      </svg>
    </div>
  );
}