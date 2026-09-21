import React, { useMemo, Suspense, useEffect } from "react";
import { createPortal } from "react-dom";
import { Navigation, Thermometer, Gauge, Loader2, X } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html, Center } from "@react-three/drei";
import MaitriEnvironment from "./MaitriEnvironment";
import BharatiEnvironment from "./BharatiEnvironment";

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
    ],
};

const CAMERA_CONFIGS = {
    Bharati: { position: [14, 10, 14], fov: 45 },
    Maitri: { position: [10, 8, 10], fov: 45 },
};

const formatVal = (val, decimals = 1) => {
    const num = Number(val);
    return Number.isNaN(num) ? (0).toFixed(decimals) : num.toFixed(decimals);
};

function Model({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

function ModelLoader() {
    return (
        <Html center>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 rounded-full backdrop-blur-md shadow-lg border border-slate-700 whitespace-nowrap">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
                <span className="text-xs font-bold font-sans text-slate-300 uppercase tracking-wider">
                    Loading 3D Twin...
                </span>
            </div>
        </Html>
    );
}

export default function FullscreenTopology({ activeStation, modules = [], environment = {}, isDay, onClose }) {
    const { windDirection = 0, windSpeed = 0, outsideTemp = 0 } = environment;

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [onClose]);

    const currentLayout = STATION_LAYOUTS[activeStation] || STATION_LAYOUTS.Maitri;
    const cameraSettings = CAMERA_CONFIGS[activeStation] || CAMERA_CONFIGS.Maitri;
    const modelUrl = activeStation === "Bharati" ? "/models/bharati.glb" : "/models/maitri.glb";

    const skyColor = isDay ? "#7dd3fc" : "#020617";
    const fogColor = isDay ? "#bae6fd" : "#020617";

    const modulesMap = useMemo(() => new Map(modules.map((m) => [m.module_id, m])), [modules]);

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col font-sans animate-in fade-in duration-200">

            {/* HEADER (Floating) */}
            <div className="absolute top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-center z-50 pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-3 drop-shadow-lg">
                    <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                        {activeStation} Topology
                    </h3>
                    <span className="font-mono text-xs font-semibold text-cyan-300 bg-cyan-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-800/50">
                        EXT {formatVal(outsideTemp, 1)}°C
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="pointer-events-auto p-2 bg-slate-900/60 hover:bg-slate-800/90 backdrop-blur-md text-white rounded-full transition-all border border-white/10 shadow-xl"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* 3D CANVAS */}
            <div className="absolute inset-0 w-full h-full z-10">
                <Canvas key={`fs-${activeStation}`} dpr={[1, 1.5]} camera={cameraSettings}>
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

                    <OrbitControls makeDefault autoRotate autoRotateSpeed={0.3} enableDamping maxPolarAngle={Math.PI / 2 - 0.05} minDistance={2} maxDistance={200} />
                </Canvas>
            </div>

            {/* LEFT SIDEBAR (Vertical Glassmorphic Data Panel) */}
            <div className="absolute top-20 bottom-6 left-0 pl-4 sm:pl-6 w-[260px] sm:w-[300px] z-50 pointer-events-none flex flex-col justify-center pb-safe">
                {/* We use max-h-full and custom scrollbar hiding so it shrinks/grows beautifully on small screens */}
                <div className="pointer-events-auto w-full bg-slate-900/40 dark:bg-slate-950/50 backdrop-blur-xl border border-white/10 dark:border-slate-700/50 rounded-2xl p-4 shadow-2xl flex flex-col gap-4 max-h-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

                    {/* Telemetry Vertical Stack */}
                    <div className="flex flex-col gap-3">
                        {currentLayout.map((config) => {
                            const m = modulesMap.get(config.id);
                            const status = m?.status || "operational";
                            const clr = STATUS_COLORS[status] || STATUS_COLORS.ok;
                            const rawTemp = m?.thermal_management?.indoor_temperature_c;
                            const temp = rawTemp !== undefined ? formatVal(rawTemp, 1) : "Auto";

                            return (
                                <div key={config.id} className="bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="min-w-0 pr-2">
                                            <h4 className="text-xs font-bold text-white truncate drop-shadow-sm">{config.name}</h4>
                                            <p className="text-[0.65rem] font-semibold uppercase tracking-wider mt-0.5 truncate drop-shadow-sm" style={{ color: clr }}>
                                                {status}
                                            </p>
                                        </div>
                                        <div className="relative flex items-center justify-center w-3 h-3 mt-1 shrink-0">
                                            {(status === "danger" || status === "fault") && (
                                                <span className="absolute w-full h-full rounded-full animate-ping opacity-50" style={{ backgroundColor: clr }} />
                                            )}
                                            <span className="w-full h-full rounded-full shadow-sm" style={{ backgroundColor: clr }} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 bg-black/30 dark:bg-black/50 rounded-lg border border-white/5 divide-x divide-white/10 overflow-hidden">
                                        <div className="flex items-center justify-center gap-1.5 p-1.5 whitespace-nowrap overflow-hidden">
                                            <Thermometer className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                            <span className="text-[0.7rem] font-mono font-semibold text-slate-100 truncate">
                                                {temp}{temp !== "Auto" && "°C"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center gap-1.5 p-1.5 whitespace-nowrap overflow-hidden">
                                            <Gauge className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                            <span className="text-[0.7rem] font-mono font-semibold text-slate-100 truncate flex items-center gap-0.5">
                                                101.3<span className="text-[0.55rem] text-slate-400 shrink-0">kPa</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Stats & Legend (Now stacked vertically for the sidebar) */}
                    <div className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-4">
                        <div className="flex items-center justify-center gap-2 text-[0.7rem] font-semibold text-slate-200 bg-black/20 px-3 py-2 rounded-xl border border-white/5">
                            <Navigation className="h-3.5 w-3.5 text-cyan-400 shrink-0" style={{ transform: `rotate(${Number(windDirection) || 0}deg)` }} />
                            <span className="whitespace-nowrap">Wind {formatVal(windDirection, 0)}° · {formatVal(windSpeed, 1)} km/h</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[0.65rem] font-semibold text-slate-200 bg-black/20 p-2.5 rounded-xl border border-white/5">
                            {Object.entries(LEGEND_LABELS).map(([key, label]) => (
                                <span key={key} className="flex items-center gap-1.5 whitespace-nowrap">
                                    <span className="h-2 w-2 rounded-full shadow-sm shrink-0" style={{ backgroundColor: STATUS_COLORS[key] }} />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
}