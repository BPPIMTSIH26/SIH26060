import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const COLORS = ["#60a5fa", "#4ade80", "#facc15", "#fb923c", "#2dd4bf"];
const RANDOM_SEQ = [3, 1, 4, 0, 2, 4, 1, 0, 3, 2, 1, 4, 2, 0, 3, 1, 4, 2];

const getRoomTemp = (blockName, colorIndex, moduleTemps, outsideTemp) => {
    const lqRef = moduleTemps?.lq ?? 19.5;
    if (blockName.includes("Main Lab")) return `${(moduleTemps?.lab ?? 19.0).toFixed(1)}°C`;
    if (blockName.includes("Storage") || blockName.includes("Logistics")) return `${(moduleTemps?.storage ?? -5.0).toFixed(1)}°C`;
    if (blockName.includes("Living Quarters")) return `${(lqRef + (colorIndex % 3) * 0.1).toFixed(1)}°C`;
    if (blockName.includes("Hospital") || blockName.includes("Office") || blockName.includes("Canteen") || blockName.includes("Auditorium")) {
        return `${(lqRef - 0.2 + (colorIndex % 2) * 0.2).toFixed(1)}°C`;
    }
    if (blockName.includes("Energy") || blockName.includes("Generator")) return `${(lqRef + 8.5).toFixed(1)}°C`;
    if (blockName.includes("Fuel")) return `${Math.max(-10, (outsideTemp || -15) + 12).toFixed(1)}°C`;
    return `${(lqRef - 0.5).toFixed(1)}°C`;
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
    const boxOpacity = isDimmed ? 0.05 : isHighlighted ? 0.9 : isActive ? 0.75 : 0.45;
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
                <meshStandardMaterial attach="material-0" color="#1e3a8a" transparent opacity={boxOpacity} side={THREE.DoubleSide} />
                <meshStandardMaterial attach="material-1" color="#1e3a8a" transparent opacity={boxOpacity} side={THREE.DoubleSide} />
                <meshStandardMaterial attach="material-2" ref={matRef2} color={displayColor} emissive={emissiveColor} emissiveIntensity={emissiveIntensity} transparent opacity={boxOpacity} side={THREE.DoubleSide} />
                <meshStandardMaterial attach="material-3" ref={matRef3} color={displayColor} emissive={emissiveColor} emissiveIntensity={emissiveIntensity} transparent opacity={boxOpacity} side={THREE.DoubleSide} />
                <meshStandardMaterial attach="material-4" color="#1e3a8a" transparent opacity={boxOpacity} side={THREE.DoubleSide} />
                <meshStandardMaterial attach="material-5" color="#1e3a8a" transparent opacity={boxOpacity} side={THREE.DoubleSide} />
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

export default function MaitriXray({ config, outsideTemp, activeCategory, moduleTemps }) {
    const [activeBlock, setActiveBlock] = useState(null);
    const handleToggle = (blockName) => setActiveBlock((prev) => (prev === blockName ? null : blockName));

    useEffect(() => {
        const close = () => setActiveBlock(null);
        window.addEventListener("close-popovers", close);
        return () => window.removeEventListener("close-popovers", close);
    }, []);

    if (!config) return null;
    const { height, y, rotY, lwX, lwZ, lwThick, lwLen, rwX, rwZ, rwThick, rwLen, spX, spZ, spLen, spThick } = config;
    const sharedProps = { outsideTemp, activeCategory, moduleTemps };

    return (
        <group position={[0, y, 0]} rotation={[0, (rotY * Math.PI) / 180, 0]}>
            <group position={[lwX, 0, lwZ]}>
                <PartitionBlock
                    position={[0, height / 2, -lwLen / 2 + lwLen / 10]}
                    width={lwThick * 0.95} height={height * 0.95} depth={(lwLen / 5) * 0.95}
                    colorIndex={RANDOM_SEQ[0]} blockName="Logistics & Supply Hub"
                    isActive={activeBlock === "Logistics & Supply Hub"}
                    onToggle={() => handleToggle("Logistics & Supply Hub")}
                    {...sharedProps}
                />
                {Array.from({ length: 4 }).map((_, i) => {
                    const sectionL = lwLen / 5;
                    const zPos = -lwLen / 2 + sectionL + (i + 0.5) * sectionL;
                    const name = i === 0 ? "Fuel Tank Farm" : `Sector N-${i + 2}`;
                    return (
                        <PartitionBlock
                            key={`lw-${i}`} position={[0, height / 2, zPos]}
                            width={lwThick * 0.95} height={height * 0.95} depth={sectionL * 0.95}
                            colorIndex={RANDOM_SEQ[i + 1]} blockName={name}
                            isActive={activeBlock === name} onToggle={() => handleToggle(name)}
                            {...sharedProps}
                        />
                    );
                })}
            </group>
            <group position={[rwX, 0, rwZ]}>
                <PartitionBlock
                    position={[0, height / 2, -rwLen / 2 + rwLen / 10]}
                    width={rwThick * 0.95} height={height * 0.95} depth={(rwLen / 5) * 0.95}
                    colorIndex={RANDOM_SEQ[5]} blockName="Living Quarters S1"
                    isActive={activeBlock === "Living Quarters S1"}
                    onToggle={() => handleToggle("Living Quarters S1")}
                    {...sharedProps}
                />
                {Array.from({ length: 4 }).map((_, i) => {
                    const sectionL = rwLen / 5;
                    const zPos = -rwLen / 2 + sectionL + (i + 0.5) * sectionL;
                    const name = i === 0 ? "Living Quarters S2" : i === 1 ? "Living Quarters S3" : `Sector S-${i + 2}`;
                    return (
                        <PartitionBlock
                            key={`rw-${i}`} position={[0, height / 2, zPos]}
                            width={rwThick * 0.95} height={height * 0.95} depth={sectionL * 0.95}
                            colorIndex={RANDOM_SEQ[i + 6]} blockName={name}
                            isActive={activeBlock === name} onToggle={() => handleToggle(name)}
                            {...sharedProps}
                        />
                    );
                })}
            </group>
            <group position={[spX, 0, spZ]}>
                <PartitionBlock
                    position={[-spLen / 2 + spLen / 12, height / 2, 0]}
                    width={(spLen / 6) * 0.95} height={height * 0.95} depth={spThick * 0.95}
                    colorIndex={RANDOM_SEQ[10]} blockName="Energy Room & Generator"
                    isActive={activeBlock === "Energy Room & Generator"}
                    onToggle={() => handleToggle("Energy Room & Generator")}
                    {...sharedProps}
                />
                {["Main Lab", "Fun Zone & Canteen", "Auditorium", "Office Room", "Hospital"].map((name, i) => {
                    const sectionL = spLen / 6;
                    const xPos = -spLen / 2 + sectionL + (i + 0.5) * sectionL;
                    return (
                        <PartitionBlock
                            key={`sp-${i}`} position={[xPos, height / 2, 0]}
                            width={sectionL * 0.95} height={height * 0.95} depth={spThick * 0.95}
                            colorIndex={RANDOM_SEQ[i + 11]} blockName={name}
                            isActive={activeBlock === name} onToggle={() => handleToggle(name)}
                            {...sharedProps}
                        />
                    );
                })}
            </group>
        </group>
    );
}