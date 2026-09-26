import React, { useMemo, Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Navigation, Thermometer, Gauge, Loader2, X, Layers } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html, Center } from "@react-three/drei";
import * as THREE from "three";
import MaitriEnvironment from "./MaitriEnvironment";
import BharatiEnvironment from "./BharatiEnvironment";
import MaitriXray from "./MaitriXray";
import BharatiXray from "./BharatiXray";

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

const MAITRI_PARTITION_CONFIG = {
    height: 0.11, y: -0.1, rotY: 0,
    lwX: -0.43, lwZ: -0.07, lwThick: 0.13, lwLen: 0.44,
    rwX: 0.42, rwZ: -0.06, rwThick: 0.16, rwLen: 0.44,
    spX: 0, spZ: 0.23, spLen: 1, spThick: 0.16,
};

const BHARATI_PARTITION_CONFIG = {
    upX: 0.00, upY: 0.06, upZ: 0.00, upW: 0.99, upH: 0.10, upD: 0.62,
    lowX: 0.10, lowY: -0.09, lowZ: 0.00, lowW: 0.66, lowH: 0.20, lowD: 0.52,
};

const MAITRI_PIPE_TARGET = { x: -6.00, z: -3.40 };
const BHARATI_PIPE_TARGET = { x: 5.10, z: -3.20 };
const BHARATI_DOME_CONFIG = { d1X: -22.30, d1Z: -10.10, d2X: 1.60, d2Z: -21.30 };

const formatVal = (val, decimals = 1) => {
    const num = Number(val);
    return val === undefined || val === null || Number.isNaN(num) ? (0).toFixed(decimals) : num.toFixed(decimals);
};

function Model({ url, viewMode = "normal", isMaitri = false, isBharati = false, outsideTemp, activeCategory, moduleTemps }) {
    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const isInfra = activeCategory === "Infrastructure";
    const pulseMaterials = useMemo(() => [], []);

    useEffect(() => {
        pulseMaterials.length = 0;
        const createdMaterials = [];
        clonedScene.traverse((node) => {
            if (node.isMesh) {
                if (node.userData.originalMaterial === undefined) {
                    node.userData.originalMaterial = node.material;
                }
                if (viewMode === "xray") {
                    const mat = new THREE.MeshStandardMaterial({
                        color: new THREE.Color(isInfra ? 0x06b6d4 : 0x44aaff),
                        transparent: true,
                        opacity: isInfra ? 0.8 : 0.25,
                        wireframe: !isInfra,
                        emissive: isInfra ? new THREE.Color(0x0891b2) : new THREE.Color(0x000000),
                        emissiveIntensity: isInfra ? 1.0 : 0,
                    });
                    node.material = mat;
                    createdMaterials.push(mat);
                    if (isInfra) pulseMaterials.push(mat);
                } else {
                    node.material = node.userData.originalMaterial;
                }
            }
        });
        return () => createdMaterials.forEach((m) => m.dispose());
    }, [clonedScene, viewMode, isInfra, pulseMaterials]);

    useFrame((state) => {
        if (isInfra && pulseMaterials.length > 0) {
            const pulse = (Math.sin(state.clock.elapsedTime * 2.5) + 1) / 2;
            const opac = 0.2 + pulse * 0.6;
            const emissive = 0.2 + pulse * 1.5;
            for (let i = 0; i < pulseMaterials.length; i++) {
                pulseMaterials[i].opacity = opac;
                pulseMaterials[i].emissiveIntensity = emissive;
            }
        }
    });

    return (
        <group>
            <primitive object={clonedScene} />
            {viewMode === "xray" && isMaitri && (
                <MaitriXray config={MAITRI_PARTITION_CONFIG} outsideTemp={outsideTemp} activeCategory={activeCategory} moduleTemps={moduleTemps} />
            )}
            {viewMode === "xray" && isBharati && (
                <BharatiXray config={BHARATI_PARTITION_CONFIG} outsideTemp={outsideTemp} activeCategory={activeCategory} moduleTemps={moduleTemps} />
            )}
        </group>
    );
}

function ModelLoader() {
    return (
        <Html center>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 rounded-full backdrop-blur-md shadow-lg border border-slate-700 whitespace-nowrap">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
                <span className="text-xs font-bold font-sans text-slate-300 uppercase tracking-wider">Loading 3D Twin...</span>
            </div>
        </Html>
    );
}

export default function FullscreenTopology({ activeStation, modules = [], environment = {}, isDay, onClose }) {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [viewMode, setViewMode] = useState("normal");
    const [activeCategory, setActiveCategory] = useState(null);
    const { windDirection = 0, windSpeed = 0, outsideTemp = 0 } = environment;

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
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

    const modulesMap = useMemo(() => {
        const map = new Map();
        modules.forEach((m) => {
            if (m.module_id) map.set(m.module_id, m);
            if (m.id) map.set(m.id, m);
        });
        return map;
    }, [modules]);

    const moduleTemps = useMemo(() => {
        const getTemp = (keys, fallback) => {
            for (const k of keys) {
                const val = modulesMap.get(k)?.thermal_management?.indoor_temperature_c;
                if (val !== undefined && val !== null && !Number.isNaN(Number(val))) return Number(val);
            }
            return fallback;
        };
        const lq = getTemp(["MOD-LQ-001", "living_quarters"], 19.5);
        return {
            lq,
            lab: getTemp(["MOD-LAB-001", "main_lab"], 19.0),
            storage: getTemp(["MOD-STORAGE-001", "storage_module"], -5.0),
            hvac: getTemp(["HVAC-001", "hvac", "climate_control"], lq),
        };
    }, [modulesMap]);

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col font-sans animate-in fade-in duration-200">
            <div className="absolute top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-start z-50 pointer-events-none">
                <div className="pointer-events-auto flex flex-col items-start gap-3 drop-shadow-lg">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <button
                                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                                className="flex items-center gap-2 text-xl font-bold tracking-tight text-white drop-shadow-md hover:text-cyan-300 transition-colors group bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg"
                            >
                                <span>{activeStation} Topology</span>
                                <span className={`text-slate-400 group-hover:text-cyan-300 transition-transform duration-300 text-sm ${isSidebarVisible ? "rotate-180" : ""}`}>▼</span>
                            </button>
                            <div className={`absolute top-full left-0 mt-2 w-[260px] sm:w-[280px] transition-all duration-300 origin-top overflow-hidden z-[100] ${isSidebarVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}`}>
                                <div className="w-full bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-xl p-3 shadow-2xl flex flex-col gap-3 max-h-[85vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                                    <div className="flex items-center justify-between bg-black/30 p-1.5 rounded-lg border border-white/10 mb-0.5">
                                        <span className="text-[0.65rem] font-bold text-slate-300">Modules Overview</span>
                                        <span className="text-[0.6rem] text-cyan-400 font-mono bg-cyan-900/30 px-2 py-0.5 rounded-full border border-cyan-800/50">LIVE</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {currentLayout.map((config) => {
                                            const m = modulesMap.get(config.id) || modulesMap.get(config.key);
                                            const status = m?.status || "operational";
                                            const clr = STATUS_COLORS[status] || STATUS_COLORS.ok;
                                            const rawTemp = m?.thermal_management?.indoor_temperature_c ?? (config.id === "HVAC-001" ? moduleTemps.lq : undefined);
                                            const temp = rawTemp !== undefined ? formatVal(rawTemp, 1) : formatVal(moduleTemps.lq, 1);
                                            return (
                                                <div key={config.id} className="bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5 rounded-lg p-2 flex flex-col justify-between overflow-hidden">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="min-w-0 pr-2">
                                                            <h4 className="text-[0.65rem] font-bold text-white truncate drop-shadow-sm">{config.name}</h4>
                                                            <p className="text-[0.55rem] font-semibold uppercase tracking-wider mt-0.5 truncate drop-shadow-sm" style={{ color: clr }}>{status}</p>
                                                        </div>
                                                        <div className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0 mt-0.5">
                                                            {(status === "danger" || status === "fault") && (
                                                                <span className="absolute w-full h-full rounded-full animate-ping opacity-50" style={{ backgroundColor: clr }} />
                                                            )}
                                                            <span className="w-full h-full rounded-full shadow-sm" style={{ backgroundColor: clr }} />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 bg-black/30 dark:bg-black/50 rounded border border-white/5 divide-x divide-white/10 overflow-hidden">
                                                        <div className="flex items-center justify-center gap-1 p-1 whitespace-nowrap overflow-hidden">
                                                            <Thermometer className="w-3 h-3 text-slate-300 shrink-0" />
                                                            <span className="text-[0.65rem] font-mono font-semibold text-slate-100 truncate">{temp}°C</span>
                                                        </div>
                                                        <div className="flex items-center justify-center gap-1 p-1 whitespace-nowrap overflow-hidden">
                                                            <Gauge className="w-3 h-3 text-slate-300 shrink-0" />
                                                            <span className="text-[0.65rem] font-mono font-semibold text-slate-100 truncate flex items-center gap-0.5">
                                                                101.3<span className="text-[0.5rem] text-slate-400 shrink-0">kPa</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-1 flex flex-col gap-2 border-t border-white/10 pt-3">
                                        <div className="flex items-center justify-center gap-1.5 text-[0.65rem] font-semibold text-slate-200 bg-black/30 px-2.5 py-1.5 rounded-lg border border-white/10">
                                            <Navigation className="h-3 w-3 text-cyan-400 shrink-0" style={{ transform: `rotate(${Number(windDirection) || 0}deg)` }} />
                                            <span className="whitespace-nowrap">Wind {formatVal(windDirection, 0)}° · {formatVal(windSpeed, 1)} km/h</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1.5 text-[0.55rem] font-semibold text-slate-200 bg-black/30 p-2 rounded-lg border border-white/10">
                                            {Object.entries(LEGEND_LABELS).map(([key, label]) => (
                                                <span key={key} className="flex items-center gap-1 whitespace-nowrap">
                                                    <span className="h-1.5 w-1.5 rounded-full shadow-sm shrink-0" style={{ backgroundColor: STATUS_COLORS[key] }} />
                                                    {label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span className="font-mono text-xs font-semibold text-cyan-300 bg-cyan-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-800/50">
                            EXT {formatVal(outsideTemp, 1)}°C
                        </span>
                        <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-lg border border-white/10 ml-0 sm:ml-4">
                            <button
                                onClick={() => { setViewMode("normal"); setActiveCategory(null); }}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === "normal" ? "bg-cyan-600 text-white shadow-lg" : "text-slate-300 hover:text-white hover:bg-white/10"}`}
                            >
                                Normal View
                            </button>
                            <button
                                onClick={() => { setViewMode("xray"); setActiveCategory(null); }}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${viewMode === "xray" ? "bg-cyan-600 text-white shadow-lg" : "text-slate-300 hover:text-white hover:bg-white/10"}`}
                            >
                                <Layers className="w-3.5 h-3.5" />
                                Structural Diagnostics
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 pointer-events-auto">
                    {viewMode === "xray" && (
                        <div className="flex gap-2">
                            {["Energy", "Infrastructure", "Logistics", "Environment"].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory((prev) => (prev === cat ? null : cat))}
                                    className={`px-3 py-1.5 text-[0.65rem] sm:text-xs font-bold rounded-full border backdrop-blur-md transition-all shadow-lg flex items-center gap-2 ${activeCategory === cat ? "bg-cyan-600/90 text-white border-cyan-400" : "bg-slate-900/60 text-slate-300 border-white/10 hover:bg-slate-800/90 hover:text-white"}`}
                                >
                                    <span>{cat}</span>
                                    {activeCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />}
                                </button>
                            ))}
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-900/60 hover:bg-slate-800/90 backdrop-blur-md text-white rounded-full transition-all border border-white/10 shadow-xl"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="absolute inset-0 w-full h-full z-10">
                <Canvas
                    key={`fs-${activeStation}`}
                    dpr={[1, 1.5]}
                    camera={cameraSettings}
                    onPointerMissed={() => window.dispatchEvent(new Event("close-popovers"))}
                >
                    <color attach="background" args={[skyColor]} />
                    <fog attach="fog" args={[fogColor, 10, 80]} />
                    <ambientLight intensity={isDay ? 0.6 : 0.2} />
                    <directionalLight position={[10, 20, 10]} intensity={isDay ? 2.5 : 1.5} color={isDay ? "#ffffff" : "#cceeff"} />
                    <Suspense fallback={<ModelLoader />}>
                        {activeStation === "Bharati" ? (
                            <BharatiEnvironment isDay={isDay} viewMode={viewMode} domeConfig={BHARATI_DOME_CONFIG} pipeTarget={BHARATI_PIPE_TARGET} activeCategory={activeCategory} />
                        ) : (
                            <MaitriEnvironment isDay={isDay} pipeTarget={MAITRI_PIPE_TARGET} viewMode={viewMode} activeCategory={activeCategory} />
                        )}
                        <group scale={14.45} position={[0, 0.5, 0]}>
                            <Center>
                                <Model
                                    key={modelUrl}
                                    url={modelUrl}
                                    viewMode={viewMode}
                                    isMaitri={activeStation === "Maitri"}
                                    isBharati={activeStation === "Bharati"}
                                    outsideTemp={outsideTemp}
                                    activeCategory={activeCategory}
                                    moduleTemps={moduleTemps}
                                />
                            </Center>
                        </group>
                    </Suspense>
                    <OrbitControls makeDefault autoRotate autoRotateSpeed={0.3} enableDamping maxPolarAngle={Math.PI / 2 - 0.05} minDistance={2} maxDistance={200} />
                </Canvas>
            </div>
        </div>,
        document.body
    );
}