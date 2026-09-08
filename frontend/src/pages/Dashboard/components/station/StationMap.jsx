import { Suspense } from "react";
import {
    Navigation,
    Thermometer,
    Gauge,
    Loader2,
} from "lucide-react";

import { Canvas } from "@react-three/fiber";
import {
    useGLTF,
    OrbitControls,
    Stage,
    Html,
} from "@react-three/drei";

/* ============================================================
   STATUS COLORS
   Matches Infrastructure backend statuses.
   ============================================================ */

const statusColor = {
    operational: "#10b981",
    nominal: "#10b981",
    ok: "#10b981",

    warning: "#f59e0b",
    warn: "#f59e0b",
    maintenance: "#f59e0b",

    danger: "#ef4444",
    fault: "#ef4444",

    offline: "#64748b",
};

const legendLabels = {
    operational: "Online",
    warning: "Warning",
    danger: "Critical",
    offline: "Offline",
};

/* ============================================================
   3D MODEL
   ============================================================ */

function Model({ url }) {
    const { scene } = useGLTF(url);

    return <primitive object={scene} />;
}

function ModelLoader() {
    return (
        <Html center>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-900/90 rounded-full backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-800 whitespace-nowrap">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-600 dark:text-cyan-400 shrink-0" />

                <span className="text-xs font-bold font-sans text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Loading 3D Twin...
                </span>
            </div>
        </Html>
    );
}

/* ============================================================
   PRELOAD MODELS
   ============================================================ */

useGLTF.preload("/models/maitri.glb");
useGLTF.preload("/models/bharati.glb");

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function StationMap({
    activeStation = "Maitri",
    modules = [],
    environment = {},
}) {
    const {
        windDirection = 0,
        windSpeed = 0,
        outsideTemp = 0,
    } = environment || {};

    /* ========================================================
       STATION LAYOUT
       These IDs must match backend infrastructure module_id
       values.
       ======================================================== */

    const layouts = {
        Maitri: [
            {
                id: "MOD-LQ-001",
                short: "LQ",
                name: "Living Quarters",
            },
            {
                id: "MOD-LAB-001",
                short: "LAB",
                name: "Main Lab",
            },
            {
                id: "MOD-STORAGE-001",
                short: "STR",
                name: "Storage Bay",
            },
            {
                id: "HVAC-001",
                short: "HVAC",
                name: "Climate Control",
            },
        ],

        Bharati: [
            {
                id: "MOD-LQ-001",
                short: "LQ",
                name: "Living Quarters",
            },
            {
                id: "MOD-LAB-001",
                short: "LAB",
                name: "Main Lab",
            },
            {
                id: "MOD-STORAGE-001",
                short: "STR",
                name: "Storage Bay",
            },
            {
                id: "HVAC-001",
                short: "HVAC",
                name: "Climate Control",
            },
        ],
    };

    const currentLayout =
        layouts[activeStation] ||
        layouts.Maitri;

    const modelUrl =
        activeStation === "Bharati"
            ? "/models/bharati.glb"
            : "/models/maitri.glb";

    /* ========================================================
       FIND MODULE
       ======================================================== */

    const getModule = (moduleId) => {
        return modules.find(
            (module) =>
                module?.module_id === moduleId
        );
    };

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-4 sm:p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60 flex flex-col transition-colors duration-300 font-sans">

            {/* =====================================================
                HEADER
               ===================================================== */}

            <div className="mb-3 sm:mb-4 flex items-center justify-between">

                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {activeStation} Topology
                </h3>

                <span className="font-mono text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/50 px-2.5 py-1 rounded-md border border-cyan-200/60 dark:border-cyan-800/50">
                    EXT {outsideTemp}°C
                </span>

            </div>

            {/* =====================================================
                3D VIEWPORT
               ===================================================== */}

            <div className="w-full h-[280px] sm:h-[390px] relative rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center cursor-move shadow-inner">

                {/* Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 dark:opacity-30 z-0 pointer-events-none" />

                <div className="absolute inset-0 w-full h-full z-10">

                    <Canvas
                        dpr={[1, 1.5]}
                        camera={{
                            position: [10, 8, 10],
                            fov: 45,
                        }}
                    >
                        <Suspense
                            fallback={
                                <ModelLoader />
                            }
                        >
                            <Stage
                                environment="city"
                                intensity={0.6}
                                adjustCamera
                                shadows={false}
                            >
                                <Model
                                    key={modelUrl}
                                    url={modelUrl}
                                />
                            </Stage>
                        </Suspense>

                        <OrbitControls
                            makeDefault
                            autoRotate
                            autoRotateSpeed={0.8}
                            enableDamping
                        />
                    </Canvas>

                </div>
            </div>

            {/* =====================================================
                MODULE TELEMETRY
               ===================================================== */}

            <div className="mt-3 sm:mt-4 grid grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-2.5 sm:gap-3">

                {currentLayout.map(
                    (config, idx) => {
                        const module =
                            getModule(
                                config.id
                            );

                        const status =
                            module?.status ||
                            "offline";

                        const color =
                            statusColor[
                                status.toLowerCase()
                            ] ||
                            statusColor.offline;

                        const temperature =
                            module
                                ?.thermal_management
                                ?.indoor_temperature_c;

                        const displayTemperature =
                            temperature ??
                            "Auto";

                        return (
                            <div
                                key={
                                    config.id ||
                                    idx
                                }
                                className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 rounded-xl p-2.5 sm:p-3 shadow-sm flex flex-col justify-between transition-colors overflow-hidden"
                            >
                                {/* MODULE HEADER */}

                                <div className="flex justify-between items-start mb-2 sm:mb-2.5">

                                    <div className="min-w-0 pr-2">

                                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                            {config.name}
                                        </h4>

                                        <p
                                            className="text-[0.65rem] font-semibold uppercase tracking-wider mt-0.5 truncate"
                                            style={{
                                                color,
                                            }}
                                        >
                                            {status}
                                        </p>

                                    </div>

                                    <div className="relative flex items-center justify-center w-2.5 h-2.5 sm:w-3 sm:h-3 mt-1 shrink-0">

                                        {(status ===
                                            "fault" ||
                                            status ===
                                                "danger") && (
                                            <span
                                                className="absolute w-full h-full rounded-full animate-ping opacity-50"
                                                style={{
                                                    backgroundColor:
                                                        color,
                                                }}
                                            />
                                        )}

                                        <span
                                            className="w-full h-full rounded-full shadow-sm"
                                            style={{
                                                backgroundColor:
                                                    color,
                                            }}
                                        />

                                    </div>
                                </div>

                                {/* MODULE METRICS */}

                                <div className="grid grid-cols-2 bg-white dark:bg-slate-950 rounded-lg border border-slate-200/60 dark:border-slate-800 divide-x divide-slate-200 dark:divide-slate-800 overflow-hidden">

                                    {/* Temperature */}

                                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 p-1.5 whitespace-nowrap overflow-hidden">

                                        <Thermometer className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                                        <span className="text-[0.7rem] font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">

                                            {displayTemperature}

                                            {displayTemperature !==
                                                "Auto" &&
                                                "°C"}

                                        </span>

                                    </div>

                                    {/* Pressure */}

                                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 p-1.5 whitespace-nowrap overflow-hidden">

                                        <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                                        <span className="text-[0.7rem] font-mono font-semibold text-slate-800 dark:text-slate-200 truncate flex items-center gap-0.5">

                                            101.3

                                            <span className="text-[0.55rem] text-slate-500 shrink-0">
                                                kPa
                                            </span>

                                        </span>

                                    </div>

                                </div>
                            </div>
                        );
                    }
                )}

            </div>

            {/* =====================================================
                FOOTER STATS + LEGEND
               ===================================================== */}

            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">

                {/* Wind */}

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-900/70 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800">

                    <Navigation
                        className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0"
                        style={{
                            transform: `rotate(${windDirection}deg)`,
                        }}
                    />

                    <span className="whitespace-nowrap font-sans">
                        Wind {windDirection}° ·{" "}
                        {windSpeed} km/h
                    </span>

                </div>

                {/* Legend */}

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-900/70 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800">

                    {Object.entries(
                        legendLabels
                    ).map(
                        ([key, label]) => (
                            <span
                                key={key}
                                className="flex items-center gap-1.5 whitespace-nowrap"
                            >
                                <span
                                    className="h-2 w-2 rounded-full shadow-sm shrink-0"
                                    style={{
                                        backgroundColor:
                                            statusColor[
                                                key
                                            ] ||
                                            statusColor.offline,
                                    }}
                                />

                                {label}
                            </span>
                        )
                    )}

                </div>

            </div>
        </div>
    );
}