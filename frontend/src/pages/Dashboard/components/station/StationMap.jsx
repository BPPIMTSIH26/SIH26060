import { Suspense } from "react";
import { Navigation, Thermometer, Gauge, Loader2 } from "lucide-react";
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Html } from '@react-three/drei';

// Internalized color maps
const statusColor = {
    ok: "#10b981", warn: "#f59e0b", warning: "#f59e0b", danger: "#ef4444",
    operational: "#10b981", nominal: "#10b981", fault: "#ef4444",
    maintenance: "#f59e0b", offline: "#64748b"
};

const legendLabels = {
    operational: "Online", warning: "Warning", danger: "Critical", offline: "Offline"
};

// ============================================================================
// 3D MODEL COMPONENTS
// ============================================================================

function Model({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

function ModelLoader() {
    return (
        <Html center>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-900/80 rounded-full backdrop-blur-md shadow-lg border border-gray-200 dark:border-slate-700 whitespace-nowrap">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="text-xs font-bold font-sans text-gray-700 dark:text-slate-300 uppercase tracking-wider">Loading 3D Twin...</span>
            </div>
        </Html>
    );
}

// Preload both models so toggling is instant
useGLTF.preload('/models/maitri.glb');
useGLTF.preload('/models/bharati.glb');

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function StationMap({ activeStation, modules = [], environment = {} }) {
    const { windDirection = 0, windSpeed = 0, outsideTemp = 0 } = environment;

    // Hardcoding the 4-node layout parameters
    const layouts = {
        Maitri: [
            { id: "MOD-LQ-001", short: "LQ", name: "Living Quarters" },
            { id: "MOD-LAB-001", short: "LAB", name: "Main Lab" },
            { id: "MOD-STORAGE-001", short: "STR", name: "Storage Bay" },
            { id: "HVAC-001", short: "HVAC", name: "Climate Control" },
        ],
        Bharati: [
            { id: "MOD-LQ-001", short: "LQ", name: "Living Quarters" },
            { id: "MOD-LAB-001", short: "LAB", name: "Main Lab" },
            { id: "MOD-STORAGE-001", short: "STR", name: "Storage Bay" },
            { id: "HVAC-001", short: "HVAC", name: "Climate Control" },
        ]
    };

    const currentLayout = layouts[activeStation] || layouts.Maitri;
    
    // Dynamically set the 3D model path based on the active station
    const modelUrl = activeStation === "Bharati" ? "/models/bharati.glb" : "/models/maitri.glb";

    return (
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-amber-50 dark:bg-slate-900/60 p-3 sm:p-5 shadow-lg flex flex-col transition-colors duration-300 font-sans">
            
            {/* HEADER */}
            <div className="mb-3 sm:mb-4 flex items-center justify-between">
                <h3 className="font-mono text-sm uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold drop-shadow-sm dark:drop-shadow-md">
                    {activeStation} TOPOLOGY
                </h3>
                <span className="font-mono text-[0.7rem] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-50 bg-cyan-50 dark:bg-cyan-950/50 px-2.5 py-1 rounded border border-cyan-200 dark:border-cyan-800/50">
                    EXT {outsideTemp}°C
                </span>
            </div>

            {/* 3D RENDER VIEWPORT */}
            <div className="w-full h-[280px] sm:h-[400px] relative rounded-lg border border-gray-200 dark:border-slate-700/50 overflow-hidden bg-white/80 dark:bg-slate-950 flex items-center justify-center cursor-move shadow-inner">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 dark:opacity-40 z-0 pointer-events-none" />
                
                <div className="absolute inset-0 w-full h-full z-10">
                    <Canvas shadows dpr={[1, 2]} camera={{ position: [10, 8, 10], fov: 45 }}>
                        <Suspense fallback={<ModelLoader />}>
                            <Stage environment="city" intensity={0.6} adjustCamera>
                                <Model key={modelUrl} url={modelUrl} />
                            </Stage>
                        </Suspense>
                        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.8} enableDamping />
                    </Canvas>
                </div>
            </div>

            {/* TELEMETRY DATA BLOCKS (Optimized Grid & No-Wrap) */}
            {/* Uses 2 columns on mobile/tablet, 2 columns on split desktop, and 4 ONLY on ultra-wide */}
            <div className="mt-3 sm:mt-4 grid grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-2 sm:gap-3">
                {currentLayout.map((config, idx) => {
                    const m = modules.find(mod => mod.module_id === config.id);
                    const status = m?.status || "operational";
                    const clr = statusColor[status] || statusColor.ok;
                    const temp = m?.thermal_management?.indoor_temperature_c || "Auto";

                    return (
                        <div key={config.id || idx} className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg p-2 sm:p-3 shadow-sm flex flex-col justify-between transition-colors overflow-hidden">
                            
                            {/* Title & Status */}
                            <div className="flex justify-between items-start mb-2 sm:mb-3">
                                <div className="min-w-0 pr-2">
                                    <h4 className="text-[0.65rem] sm:text-xs font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wide truncate">{config.name}</h4>
                                    <p className="text-[0.6rem] font-mono uppercase tracking-widest mt-0.5 truncate" style={{ color: clr }}>
                                        {status}
                                    </p>
                                </div>
                                {/* Status Indicator Dot */}
                                <div className="relative flex items-center justify-center w-2.5 h-2.5 sm:w-3 sm:h-3 mt-1 shrink-0">
                                    {(status === "danger" || status === "fault") && (
                                        <span className="absolute w-full h-full rounded-full animate-ping opacity-50" style={{ backgroundColor: clr }} />
                                    )}
                                    <span className="w-full h-full rounded-full" style={{ backgroundColor: clr, boxShadow: `0 0 8px ${clr}` }} />
                                </div>
                            </div>
                            
                            {/* Strictly formatted metrics row to prevent wrapping */}
                            <div className="grid grid-cols-2 bg-gray-50 dark:bg-slate-900/50 rounded border border-gray-100 dark:border-slate-800/50 divide-x divide-gray-200 dark:divide-slate-700/80">
                                
                                {/* Temperature */}
                                <div className="flex items-center justify-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 whitespace-nowrap overflow-hidden">
                                    <Thermometer className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-slate-400 shrink-0" />
                                    <span className="text-[0.65rem] sm:text-[0.7rem] font-mono font-bold text-gray-800 dark:text-slate-200 truncate">
                                        {temp}{temp !== "Auto" && "°C"}
                                    </span>
                                </div>
                                
                                {/* Pressure */}
                                <div className="flex items-center justify-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 whitespace-nowrap overflow-hidden">
                                    <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-slate-400 shrink-0" />
                                    <span className="text-[0.65rem] sm:text-[0.7rem] font-mono font-bold text-gray-800 dark:text-slate-200 truncate flex items-center gap-0.5">
                                        101.3<span className="text-[0.55rem] text-gray-500 shrink-0">kPa</span>
                                    </span>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FOOTER STATS & LEGEND */}
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-wider text-gray-600 dark:text-slate-400 bg-white/60 dark:bg-slate-950/50 px-2.5 py-1.5 rounded border border-gray-200 dark:border-slate-800 transition-colors duration-300">
                    <Navigation className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-500 shrink-0" style={{ transform: `rotate(${windDirection}deg)` }} />
                    <span className="whitespace-nowrap">Wind {windDirection}° · {windSpeed} km/h</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 font-mono text-[0.6rem] uppercase tracking-wider bg-white/60 dark:bg-slate-950/50 px-2.5 py-1.5 rounded border border-gray-200 dark:border-slate-800">
                    {Object.entries(legendLabels).map(([key, label]) => (
                        <span key={key} className="flex items-center gap-1.5 text-gray-600 dark:text-slate-500 whitespace-nowrap">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full shadow-sm shrink-0" style={{ backgroundColor: statusColor[key] }} />
                            {label}
                        </span>
                    ))}
                </div>
            </div>
            
        </div>
    );
}