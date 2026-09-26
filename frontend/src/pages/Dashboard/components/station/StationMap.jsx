import React, { useState, useEffect, useMemo, Suspense } from "react";
import { Navigation, Thermometer, Gauge, Loader2, Maximize2 } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html, Center } from "@react-three/drei";
import MaitriEnvironment from "./MaitriEnvironment";
import BharatiEnvironment from "./BharatiEnvironment";
import FullscreenTopology from "./FullscreenTopology";

const STATUS_COLORS = {
    ok: "#10b981", warn: "#f59e0b", warning: "#f59e0b", danger: "#ef4444",
    operational: "#10b981", nominal: "#10b981", fault: "#ef4444",
    maintenance: "#f59e0b", offline: "#64748b",
};

const LEGEND_LABELS = {
    operational: "Online", warning: "Warning", danger: "Critical", offline: "Offline",
};

const STATION_LAYOUTS = {
    Maitri: [
        { id: "MOD-LQ-001", key: "living_quarters", short: "LQ", name: "Living Quarters" },
        { id: "MOD-LAB-001", key: "main_lab", short: "LAB", name: "Main Lab" },
        { id: "MOD-STORAGE-001", key: "storage_module", short: "STR", name: "Storage Bay" },
        { id: "HVAC-001", key: "hvac", short: "HVAC", name: "Climate Control" },
    ],
    Bharati: [
        { id: "MOD-LQ-001", key: "living_quarters", short: "LQ", name: "Living Quarters" },
        { id: "MOD-LAB-001", key: "main_lab", short: "LAB", name: "Main Lab" },
        { id: "MOD-STORAGE-001", key: "storage_module", short: "STR", name: "Storage Bay" },
        { id: "HVAC-001", key: "hvac", short: "HVAC", name: "Climate Control" },
    ],
};

const CAMERA_CONFIGS = {
    Bharati: { position: [14, 10, 14], fov: 45 },
    Maitri: { position: [10, 8, 10], fov: 45 },
};

const formatVal = (val, decimals = 1) => {
    const num = Number(val);
    return val === undefined || val === null || Number.isNaN(num) ? (0).toFixed(decimals) : num.toFixed(decimals);
};

const getIsAntarcticDay = () => {
    const now = new Date();
    const month = now.getMonth();
    const date = now.getDate();
    if ((month > 2 && month < 8) || (month === 2 && date >= 21) || (month === 8 && date < 21)) {
        return false;
    }
    return true;
};

useGLTF.preload("/models/maitri.glb");
useGLTF.preload("/models/bharati.glb");

function Model({ url }) {
    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    return <primitive object={clonedScene} />;
}

function ModelLoader() {
    return (
        <Html center>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-900/90 rounded-full backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-800 whitespace-nowrap">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="text-xs font-bold font-sans text-slate-700 dark:text-slate-300 uppercase tracking-wider">Loading 3D Twin...</span>
            </div>
        </Html>
    );
}

export default function StationMap({ activeStation = "Maitri", modules = [], environment = {} }) {
    const { windDirection = 0, windSpeed = 0, outsideTemp = 0 } = environment;
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [isDay, setIsDay] = useState(getIsAntarcticDay);

    useEffect(() => {
        const timer = setInterval(() => setIsDay(getIsAntarcticDay()), 60000);
        return () => clearInterval(timer);
    }, []);

    const currentLayout = STATION_LAYOUTS[activeStation] || STATION_LAYOUTS.Maitri;
    const cameraSettings = CAMERA_CONFIGS[activeStation] || CAMERA_CONFIGS.Maitri;
    const modelUrl = activeStation === "Bharati" ? "/models/bharati.glb" : "/models/maitri.glb";
    const skyColor = isDay ? "#7dd3fc" : "#020617";
    const fogColor = isDay ? "#bae6fd" : "#020617";

    const modulesMap = useMemo(() => {
        const map = new Map();
        modules.forEach((m) => {
            if (m.module_id) map.set(m.module_id, m);
            if (m.id) map.set(m.id, m);
        });
        return map;
    }, [modules]);

    const lqReferenceTemp = useMemo(() => {
        const lqMod = modulesMap.get("MOD-LQ-001") || modulesMap.get("living_quarters");
        const val = lqMod?.thermal_management?.indoor_temperature_c;
        return val !== undefined && val !== null && !Number.isNaN(Number(val)) ? Number(val) : undefined;
    }, [modulesMap]);

    return (
        <>
            {showFullscreen && (
                <FullscreenTopology
                    activeStation={activeStation}
                    modules={modules}
                    environment={environment}
                    isDay={isDay}
                    onClose={() => setShowFullscreen(false)}
                />
            )}
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 flex flex-col transition-colors duration-300 font-sans">
                <div className="mb-3 sm:mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">{activeStation} Topology</h3>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/50 px-2.5 py-1 rounded-md border border-cyan-200/60 dark:border-cyan-800/50">
                            EXT {formatVal(outsideTemp, 1)}°C
                        </span>
                        <button
                            onClick={() => setShowFullscreen(true)}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Expand to Fullscreen"
                            aria-label="Expand to Fullscreen"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="w-full h-[280px] sm:h-[390px] relative rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center cursor-move shadow-inner">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 dark:opacity-30 z-0 pointer-events-none" />
                    <div className="absolute inset-0 w-full h-full z-10">
                        <Canvas key={activeStation} dpr={[1, 1.5]} camera={cameraSettings} frameloop={showFullscreen ? "demand" : "always"}>
                            <color attach="background" args={[skyColor]} />
                            <fog attach="fog" args={[fogColor, 10, 80]} />
                            <ambientLight intensity={isDay ? 0.6 : 0.2} />
                            <directionalLight position={[10, 20, 10]} intensity={isDay ? 2.5 : 1.5} color={isDay ? "#ffffff" : "#cceeff"} />
                            <Suspense fallback={<ModelLoader />}>
                                {activeStation === "Bharati" ? <BharatiEnvironment isDay={isDay} /> : <MaitriEnvironment isDay={isDay} />}
                                <group scale={14.45} position={[0, 0.5, 0]}>
                                    <Center>
                                        <Model key={modelUrl} url={modelUrl} />
                                    </Center>
                                </group>
                            </Suspense>
                            <OrbitControls
                                makeDefault
                                autoRotate={!showFullscreen}
                                autoRotateSpeed={0.4}
                                enableDamping
                                maxPolarAngle={Math.PI / 2 - 0.05}
                                minDistance={2}
                                maxDistance={200}
                            />
                        </Canvas>
                    </div>
                </div>
                <div className="mt-3 sm:mt-4 grid grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-2.5 sm:gap-3">
                    {currentLayout.map((config) => {
                        const m = modulesMap.get(config.id) || modulesMap.get(config.key);
                        const status = m?.status || "operational";
                        const clr = STATUS_COLORS[status] || STATUS_COLORS.ok;
                        const rawTemp = m?.thermal_management?.indoor_temperature_c ?? (config.id === "HVAC-001" ? lqReferenceTemp : undefined);
                        const temp = rawTemp !== undefined ? formatVal(rawTemp, 1) : "Auto";

                        return (
                            <div key={config.id} className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 rounded-xl p-2.5 sm:p-3 shadow-sm flex flex-col justify-between transition-colors overflow-hidden">
                                <div className="flex justify-between items-start mb-2 sm:mb-2.5">
                                    <div className="min-w-0 pr-2">
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{config.name}</h4>
                                        <p className="text-[0.65rem] font-semibold uppercase tracking-wider mt-0.5 truncate" style={{ color: clr }}>{status}</p>
                                    </div>
                                    <div className="relative flex items-center justify-center w-2.5 h-2.5 sm:w-3 sm:h-3 mt-1 shrink-0">
                                        {(status === "danger" || status === "fault") && (
                                            <span className="absolute w-full h-full rounded-full animate-ping opacity-50" style={{ backgroundColor: clr }} />
                                        )}
                                        <span className="w-full h-full rounded-full shadow-sm" style={{ backgroundColor: clr }} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 bg-white dark:bg-slate-950 rounded-lg border border-slate-200/60 dark:border-slate-800 divide-x divide-slate-200 dark:divide-slate-800 overflow-hidden">
                                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 p-1.5 whitespace-nowrap overflow-hidden">
                                        <Thermometer className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="text-[0.7rem] font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">
                                            {temp}{temp !== "Auto" && "°C"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 p-1.5 whitespace-nowrap overflow-hidden">
                                        <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="text-[0.7rem] font-mono font-semibold text-slate-800 dark:text-slate-200 truncate flex items-center gap-0.5">
                                            101.3<span className="text-[0.55rem] text-slate-500 shrink-0">kPa</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-900/70 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        <Navigation className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" style={{ transform: `rotate(${Number(windDirection) || 0}deg)` }} />
                        <span className="whitespace-nowrap font-sans">Wind {formatVal(windDirection, 0)}° · {formatVal(windSpeed, 1)} km/h</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-900/70 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        {Object.entries(LEGEND_LABELS).map(([key, label]) => (
                            <span key={key} className="flex items-center gap-1.5 whitespace-nowrap">
                                <span className="h-2 w-2 rounded-full shadow-sm shrink-0" style={{ backgroundColor: STATUS_COLORS[key] }} />
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}