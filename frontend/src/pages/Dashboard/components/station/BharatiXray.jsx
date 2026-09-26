/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#f97316", "#14b8a6"];

const getRoomTemp = (blockName, colorIndex, moduleTemps, outsideTemp) => {
    const lqRef = moduleTemps?.lq ?? 19.5;
    if (blockName.includes("Main Lab")) return `${(moduleTemps?.lab ?? 19.0).toFixed(1)}°C`;
    if (blockName.includes("Storage")) return `${(moduleTemps?.storage ?? -5.0).toFixed(1)}°C`;
    if (blockName.includes("Living Quarters")) return `${(lqRef + (colorIndex % 3) * 0.1).toFixed(1)}°C`;
    if (blockName.includes("Hospital") || blockName.includes("Office") || blockName.includes("Canteen") || blockName.includes("Auditorium")) {
        return `${(lqRef - 0.2 + (colorIndex % 2) * 0.2).toFixed(1)}°C`;
    }
    if (blockName.includes("Energy")) return `${(lqRef + 8.5).toFixed(1)}°C`;
    const fallback = outsideTemp ? Math.max(18, Math.min(24, outsideTemp + 35)) : lqRef;
    return `${fallback.toFixed(1)}°C`;
};

function PartitionBlock({ width, height, depth, position, colorIndex, blockName, isActive, onToggle, outsideTemp, activeCategory, moduleTemps }) {
    const colorHex = COLORS[colorIndex % COLORS.length];
    let matchesCategory = false;
    if (activeCategory === "Energy") {
        matchesCategory = blockName.includes("Energy") || blockName.includes("Fuel") || blockName.includes("Generator");
    } else if (activeCategory === "Logistics") {
        matchesCategory = blockName.includes("Logistics") || blockName.includes("Storage") || blockName.includes("Sector");
    } else if (activeCategory === "Infrastructure") {
        matchesCategory = blockName.includes("Lab") || blockName.includes("Quarters") || blockName.includes("Hospital") || blockName.includes("Auditorium") || blockName.includes("Office") || blockName.includes("Canteen");
    }

    const isHighlighted = Boolean(activeCategory && matchesCategory);
    const isDimmed = Boolean(activeCategory && !matchesCategory);
    const displayColor = isHighlighted ? "#06b6d4" : colorHex;
    const emissiveColor = isHighlighted ? "#0891b2" : isActive ? colorHex : "#000000";
    const emissiveIntensity = isHighlighted ? 1.5 : isActive ? 0.6 : 0;
    const boxOpacity = isDimmed ? 0.05 : isHighlighted ? 0.9 : isActive ? 0.9 : 0.65;
    const sideOpacity = isDimmed ? 0.05 : isHighlighted ? 0.95 : isActive ? 0.95 : 0.85;
    const borderOpacity = isDimmed ? 0.05 : isHighlighted ? 0.9 : 0.6;
    const displayTemp = getRoomTemp(blockName, colorIndex, moduleTemps, outsideTemp);

    const matRef2 = useRef();
    const matRef3 = useRef();

    useFrame((state) => {
        if (isHighlighted) {
            const pulse = (Math.sin(state.clock.elapsedTime * 2.5) + 1) / 2;
            const dynamicIntensity = 0.5 + pulse * 2.0;
            if (matRef2.current) matRef2.current.emissiveIntensity = dynamicIntensity;
            if (matRef3.current) matRef3.current.emissiveIntensity = dynamicIntensity;
        } else {
            const staticIntensity = isActive ? 0.6 : 0;
            if (matRef2.current) matRef2.current.emissiveIntensity = staticIntensity;
            if (matRef3.current) matRef3.current.emissiveIntensity = staticIntensity;
        }
    });

    return (
        <group position={position}>
            <mesh>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial attach="material-0" color="#1e3a8a" transparent opacity={sideOpacity} side={THREE.DoubleSide} />
                <meshStandardMaterial attach="material-1" color="#1e3a8a" transparent opacity={sideOpacity} side={THREE.DoubleSide} />
                <meshStandardMaterial attach="material-2" ref={matRef2} color={displayColor} emissive={emissiveColor} emissiveIntensity={emissiveIntensity} transparent opacity={boxOpacity} side={THREE.DoubleSide} />
                <meshStandardMaterial attach="material-3" ref={matRef3} color={displayColor} emissive={emissiveColor} emissiveIntensity={emissiveIntensity} transparent opacity={boxOpacity} side={THREE.DoubleSide} />
                <meshStandardMaterial attach="material-4" color="#1e3a8a" transparent opacity={sideOpacity} side={THREE.DoubleSide} />
                <meshStandardMaterial attach="material-5" color="#1e3a8a" transparent opacity={sideOpacity} side={THREE.DoubleSide} />
            </mesh>
            {(isActive || isHighlighted) && !isDimmed && (
                <mesh>
                    <boxGeometry args={[width * 1.03, height * 1.03, depth * 1.03]} />
                    <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={borderOpacity} />
                </mesh>
            )}
            <Html position={[0, 0, 0]} center zIndexRange={[100, 0]}>
                <div
                    className={`relative flex items-center justify-center cursor-pointer group ${isDimmed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                    onClick={(e) => { e.stopPropagation(); onToggle(); }}
                >
                    <div className={`w-1.5 h-1.5 rounded-full ${isActive || isHighlighted ? "bg-cyan-400 scale-150" : "bg-white/90"} shadow-[0_0_8px_rgba(255,255,255,1)] group-hover:scale-150 group-hover:bg-white transition-all`} />
                    {(isActive || isHighlighted) && (
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-36 bg-slate-900/90 backdrop-blur-md border border-cyan-500/50 p-3 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] text-white pointer-events-none transition-all animate-in fade-in zoom-in-95 duration-200">
                            <h3 className="text-[0.6rem] font-bold text-cyan-400 mb-1 uppercase tracking-wider">{blockName}</h3>
                            <div className="flex flex-col gap-1 text-[0.55rem] text-slate-300">
                                <div className="flex justify-between"><span>Status:</span> <span className="text-emerald-400">Online</span></div>
                                <div className="flex justify-between"><span>Temp:</span> <span>{displayTemp}</span></div>
                            </div>
                        </div>
                    )}
                </div>
            </Html>
        </group>
    );
}

function PartitionGrid({ cols, rows, baseX, baseY, baseZ, totalW, totalH, totalD, baseName, customNames = [], activeBlock, handleToggle, outsideTemp, activeCategory, moduleTemps }) {
    const blocks = [];
    const blockW = totalW / cols;
    const blockD = totalD / rows;
    const startX = baseX - totalW / 2 + blockW / 2;
    const startZ = baseZ - totalD / 2 + blockD / 2;

    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = startX + c * blockW;
            const z = startZ + r * blockD;
            const blockName = customNames[count] || `${baseName} ${count + 1}`;
            blocks.push(
                <PartitionBlock
                    key={blockName}
                    width={blockW} height={totalH} depth={blockD}
                    position={[x, baseY, z]}
                    colorIndex={count} blockName={blockName}
                    isActive={activeBlock === blockName}
                    onToggle={() => handleToggle(blockName)}
                    outsideTemp={outsideTemp}
                    activeCategory={activeCategory}
                    moduleTemps={moduleTemps}
                />
            );
            count++;
        }
    }
    return <group>{blocks}</group>;
}

export default function BharatiXray({ config, outsideTemp, activeCategory, moduleTemps }) {
    const [activeBlock, setActiveBlock] = useState(null);
    const handleToggle = (blockName) => setActiveBlock((prev) => (prev === blockName ? null : blockName));

    useEffect(() => {
        const close = () => setActiveBlock(null);
        window.addEventListener("close-popovers", close);
        return () => window.removeEventListener("close-popovers", close);
    }, []);

    if (!config) return null;
    const { upX, upY, upZ, upW, upH, upD, lowX, lowY, lowZ, lowW, lowH, lowD } = config;
    const sharedProps = { activeBlock, handleToggle, outsideTemp, activeCategory, moduleTemps };

    return (
        <group>
            <PartitionGrid
                cols={3} rows={2}
                baseX={upX} baseY={upY} baseZ={upZ}
                totalW={upW} totalH={upH} totalD={upD}
                baseName="Upper Module"
                customNames={["Main Lab", "Fun Zone & Canteen", "Auditorium", "Storage Bay", "Hospital", "Office Room"]}
                {...sharedProps}
            />
            <PartitionGrid
                cols={2} rows={2}
                baseX={lowX} baseY={lowY} baseZ={lowZ}
                totalW={lowW} totalH={lowH} totalD={lowD}
                baseName="Lower Module"
                customNames={["Energy Control Room", "Living Quarters S1", "Living Quarters S2", "Living Quarters S3"]}
                {...sharedProps}
            />
        </group>
    );
}